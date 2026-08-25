Add-Type -AssemblyName System.Drawing

$srcPath = "f:\Coding\Full project\engaz-developments\images\logo.png"
$destPath = "f:\Coding\Full project\engaz-developments\images\gold-logo.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$w = $src.Width
$h = $src.Height

# The gold logo is on the right side of logo.png (x from w/2 to w)
$cropX = [int]($w * 0.48)
$cropWidth = [int]($w - $cropX)

$rect = New-Object System.Drawing.Rectangle($cropX, 0, $cropWidth, $h)
$goldBmp = $src.Clone($rect, $src.PixelFormat)

$goldBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$src.Dispose()
$goldBmp.Dispose()
Write-Host "Exact Gold Logo cropped successfully!"
