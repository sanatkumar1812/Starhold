import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { encrypt, decrypt } from '@/lib/encryption';
import type { Json } from '@/integrations/supabase/types';

export interface Memory {
  id: string;
  user_id: string;
  recipient_name: string;
  title: string | null;
  message: string | null;
  constellation: string | null;
  star_coordinates: Json | null;
  unlock_date: string;
  unlock_time: string;
  is_unlocked: boolean;
  attachment_url: string | null;
  share_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMemoryInput {
  recipient_name: string;
  title?: string;
  message?: string;
  constellation?: string;
  star_coordinates?: Json;
  unlock_date: string;
  unlock_time?: string;
  attachment_url?: string;
}

export const useMemories = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMemories = async () => {
    if (!user) {
      setMemories([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching memories:', error);
      toast.error('Failed to load memories');
    } else {
      // Check and update unlock status based on current date/time
      const now = new Date();
      const updatedMemories = (data || []).map(memory => {
        const unlockDateTime = new Date(`${memory.unlock_date}T${memory.unlock_time}`);
        const shouldBeUnlocked = now >= unlockDateTime;

        if (shouldBeUnlocked && !memory.is_unlocked) {
          // Update in database
          supabase
            .from('memories')
            .update({ is_unlocked: true })
            .eq('id', memory.id)
            .then(() => { });
          return { ...memory, is_unlocked: true };
        }
        return memory;
      }).map(memory => ({
        ...memory,
        recipient_name: decrypt(memory.recipient_name),
        message: memory.message ? decrypt(memory.message) : null,
        title: memory.title ? decrypt(memory.title) : null
      }));
      setMemories(updatedMemories as Memory[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMemories();
  }, [user]);

  const createMemory = async (input: CreateMemoryInput): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to create a memory');
      return false;
    }

    const { error } = await supabase.from('memories').insert([{
      user_id: user.id,
      recipient_name: encrypt(input.recipient_name),
      title: input.title ? encrypt(input.title) : null,
      message: input.message ? encrypt(input.message) : null,
      constellation: input.constellation || null,
      star_coordinates: input.star_coordinates || null,
      unlock_date: input.unlock_date,
      unlock_time: input.unlock_time || '00:00:00',
      attachment_url: input.attachment_url || null,
    }]);

    if (error) {
      console.error('Error creating memory:', error);
      toast.error(`Failed to create memory: ${error.message}`);
      return false;
    }

    await fetchMemories();
    return true;
  };

  const deleteMemory = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting memory:', error);
      toast.error('Failed to delete memory');
      return false;
    }

    await fetchMemories();
    return true;
  };

  const generateShareToken = async (id: string): Promise<string | null> => {
    const token = crypto.randomUUID().replace(/-/g, '').slice(0, 16);

    const { error } = await supabase
      .from('memories')
      .update({ share_token: token })
      .eq('id', id);

    if (error) {
      console.error('Error generating share token:', error);
      toast.error('Failed to generate share link');
      return null;
    }

    await fetchMemories();
    return `${window.location.origin}/memory/${token}`;
  };

  return {
    memories,
    isLoading,
    createMemory,
    deleteMemory,
    generateShareToken,
    refetch: fetchMemories,
  };
};
