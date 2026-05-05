Add-Type -Path "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\System.IO.dll" -ErrorAction SilentlyContinue

$pdfPath = "C:\Users\shalini\.gemini\antigravity\brain\33653ff3-26ed-4e6e-b28f-4a89d5da7e25\.tempmediaStorage\07f692ea3b2e8cc5.pdf"
$bytes = [System.IO.File]::ReadAllBytes($pdfPath)
# Extract readable ASCII text from the PDF binary
$text = [System.Text.Encoding]::ASCII.GetString($bytes)
# Find text between BT and ET markers (PDF text objects)
$matches = [regex]::Matches($text, '\(([^\)]{3,})\)')
$lines = $matches | ForEach-Object { $_.Groups[1].Value } | Where-Object { $_ -match '[a-zA-Z]{3,}' }
$output = $lines -join "`n"
[System.IO.File]::WriteAllText("C:\Users\shalini\starhold\pdf_extracted.txt", $output, [System.Text.Encoding]::UTF8)
Write-Host "Extracted $($lines.Count) text fragments"
