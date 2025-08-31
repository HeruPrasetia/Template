<?php
try {
    header("Access-Control-Allow-Origin: *");
    date_default_timezone_set("Asia/Bangkok");
    $slug = $_GET['slug'] ?? '';
    $domain = $_SERVER['HTTP_HOST'];

    $iniFile  = strtolower(pathinfo($_SERVER['PHP_SELF'], PATHINFO_FILENAME));
    $date     = date('Y-m-d');
    $time     = date('Y-m-d H:i:s');
    try {
        $kon = new PDO("mysql:host=localhost;dbname=dbapis", "naylatools", "N@yl4naylatools");
        $kon->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
        $kon->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $kon->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
        $profile = $kon->query("SELECT a.* FROM dbmservice a INNER JOIN dbmdomain b ON a.ID = b.ServiceID WHERE b.Domain = '$domain'")->fetch();
    } catch (PDOException $e) {
        print json_encode(["status" => "gagal", "pesan" => "Koneksi bermasalah: " . $e->getMessage()]);
        die();
    }
} catch (PDOException $e) {
    print json_encode(["status" => "gagal", "pesan" => $e->getMessage()]);
    die();
}

$title = $profile->Nama;
$desc = $profile->Keterangan;
$image = "https://wapi.naylatools.com/file/$profile->Logo";
$url = "https://$domain/$slug";
?>
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title><?= $title ?></title>

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="<?= $title ?>" />
    <meta property="og:description" content="<?= $desc ?>" />
    <meta property="og:image" content="<?= $image ?>" />
    <meta property="og:url" content="<?= $url ?>" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?= $title ?>" />
    <meta name="twitter:description" content="<?= $desc ?>" />
    <meta name="twitter:image" content="<?= $image ?>" />

    <!-- Redirect ke React App -->
    <meta http-equiv="refresh" content="0; url=/<?= $slug ?>" />
</head>

<body>
</body>

</html>