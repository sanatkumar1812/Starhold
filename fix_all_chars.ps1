$srcPath = 'c:\Users\shalini\starhold\src'
$files = Get-ChildItem $srcPath -Recurse -Include '*.tsx','*.ts'
$badChars = [char[]]@(0x2014, 0x2019, 0x2018, 0x201C, 0x201D)
foreach ($file in $files) {
    $raw = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $dirty = $false
    foreach ($c in $badChars) {
        if ($raw.IndexOf($c) -ge 0) { $dirty = $true; break }
    }
    if ($dirty) {
        $raw = $raw -replace [char]0x2014, '-'
        $raw = $raw -replace [char]0x2019, "'"
        $raw = $raw -replace [char]0x2018, "'"
        $raw = $raw -replace [char]0x201D, '"'
        $raw = $raw -replace [char]0x201C, '"'
        [System.IO.File]::WriteAllText($file.FullName, $raw, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed: $($file.FullName)"
    }
}
Write-Host "Scan complete"
