# Read the file
$filePath = 'c:\Users\shalini\starhold\src\v2\pages\V2LandingPage.tsx'
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# 1. HERO section: add gradient fade to the Problem section bg (#020508) at bottom
$heroClose = '<div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center space-y-12">'
$heroCloseNew = "                    {/* Gradient fade to next section */}
                    <div className=""absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-[#020508] pointer-events-none z-20"" />
                    " + $heroClose
$content = $content.Replace($heroClose, $heroCloseNew)

# 2. PROBLEM section: lose the border, add fade to Solution bg (#030a10)
$problemClass = '"py-32 relative overflow-hidden border-b border-white/5">' + [char]10 + '                    {/* Background gradient - deep red tones */}'
$problemClassNew = '"py-32 relative overflow-hidden">' + [char]10 + '                    {/* Background gradient - deep red tones */}'
$content = $content.Replace($problemClass, $problemClassNew)

$problemEnd = '<div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/6 rounded-full blur-[180px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />'
$problemEndNew = '<div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/6 rounded-full blur-[180px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />' + [char]10 + '                    {/* Gradient fade to next section */}' + [char]10 + '                    <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-[#030a10] pointer-events-none z-20" />'
$content = $content.Replace($problemEnd, $problemEndNew)

# 3. SOLUTION section: lose the border, add fade to Roadmap bg (#040814)
$solutionClass = '"py-32 relative overflow-hidden border-b border-white/5">' + [char]10 + '                    {/* Background - cyan/teal tones */}'
$solutionClassNew = '"py-32 relative overflow-hidden">' + [char]10 + '                    {/* Background - cyan/teal tones */}'
$content = $content.Replace($solutionClass, $solutionClassNew)

$solutionEnd = '<div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-700/8 rounded-full blur-[160px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />'
$solutionEndNew = '<div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-700/8 rounded-full blur-[160px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />' + [char]10 + '                    {/* Gradient fade to next section */}' + [char]10 + '                    <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-[#040814] pointer-events-none z-20" />'
$content = $content.Replace($solutionEnd, $solutionEndNew)

# 4. ROADMAP section: lose the border, add fade to black (B2B/B2C section)
$roadmapClass = '"py-28 relative overflow-hidden border-b border-white/5">'
$roadmapClassNew = '"py-28 relative overflow-hidden">'
$content = $content.Replace($roadmapClass, $roadmapClassNew)

$roadmapEnd = '<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[180px] translate-y-1/3 pointer-events-none" />'
$roadmapEndNew = '<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[180px] translate-y-1/3 pointer-events-none" />' + [char]10 + '                    {/* Gradient fade to next section */}' + [char]10 + '                    <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-black pointer-events-none z-20" />'
$content = $content.Replace($roadmapEnd, $roadmapEndNew)

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Section transitions patched"
