Add-Type -AssemblyName System.Drawing
$srcPath = "f:\Coding\Full project\engaz-developments\images\logo.png"
$dstPath = "f:\Coding\Full project\engaz-developments\images\gold-logo.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$w = $src.Width
$h = $src.Height

# The gold logo is on the right half of logo.png
$cropX = [int]($w * 0.50)
$cropWidth = [int]($w * 0.50)
$cropHeight = $h

$cropRect = New-Object System.Drawing.Rectangle($cropX, 0, $cropWidth, $cropHeight)
$target = New-Object System.Drawing.Bitmap($cropWidth, $cropHeight)
$g = [System.Drawing.Graphics]::FromImage($target)
$g.DrawImage($src, 0, 0, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)

$target.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$target.Dispose()
$src.Dispose()
Write-Host "Gold logo successfully cropped and saved to gold-logo.png!"
