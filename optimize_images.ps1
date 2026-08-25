Add-Type -AssemblyName System.Drawing

function Convert-ToJpg {
    param($srcPath, $dstPath, $quality = 85)
    if (Test-Path $srcPath) {
        $bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
        $bmp.Save($dstPath, $codec, $ep)
        $bmp.Dispose()
        Write-Host "Converted $srcPath to $dstPath ($quality%)"
    }
}

Convert-ToJpg "f:\Coding\Full project\engaz-developments\images\tanta-town-mall-hd.png" "f:\Coding\Full project\engaz-developments\images\tanta-town-mall-hd.jpg" 85
Convert-ToJpg "f:\Coding\Full project\engaz-developments\images\tanta-town-mall-1.png" "f:\Coding\Full project\engaz-developments\images\tanta-town-mall-1.jpg" 85
Convert-ToJpg "f:\Coding\Full project\engaz-developments\images\mansoura-villas-hd.jpg" "f:\Coding\Full project\engaz-developments\images\mansoura-villas-opt.jpg" 85
Convert-ToJpg "f:\Coding\Full project\engaz-developments\images\fayrouz-tower-3d.jpg" "f:\Coding\Full project\engaz-developments\images\fayrouz-tower-opt.jpg" 85
Convert-ToJpg "f:\Coding\Full project\engaz-developments\images\teachers-syndicate-day.jpg" "f:\Coding\Full project\engaz-developments\images\teachers-syndicate-opt.jpg" 85
Convert-ToJpg "f:\Coding\Full project\engaz-developments\images\ras-el-bar-hd.jpg" "f:\Coding\Full project\engaz-developments\images\ras-el-bar-opt.jpg" 85
