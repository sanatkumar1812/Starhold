$filePath = 'c:\Users\shalini\starhold\src\v2\pages\V2LandingPage.tsx'
$bytes = [System.IO.File]::ReadAllBytes($filePath)
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
# Replace em dash U+2014 with plain text dash
$content = $content -replace [char]0x2014, '-'
# Replace right single quote U+2019 with ASCII apostrophe
$content = $content -replace [char]0x2019, "'"
# Replace left single quote U+2018 with ASCII apostrophe
$content = $content -replace [char]0x2018, "'"
# Replace right double quote U+201D
$content = $content -replace [char]0x201D, '"'
# Replace left double quote U+201C
$content = $content -replace [char]0x201C, '"'
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done - special chars replaced"
