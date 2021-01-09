<?php
class Pico_Rss {

    const ENTRY_LIMIT = 10;

    private $base_url;
    private $content_dir;
    private $is_feed;
    private $newest;
    private $host;
    private $json = ['blog', 'bio'];

    public function config_loaded ( &$settings ) {
        $this->base_url = $settings['base_url'];
        $this->content_dir = $settings['content_dir'];
        $this->host = parse_url( $settings['base_url'], PHP_URL_HOST );
    }

	public function request_url ( &$url ) {
		$this->is_feed = $url === 'feed';
	}

    public function before_read_file_meta ( &$headers ) {
        $headers['date_modified'] = 'Modified';
    }

    public function get_page_data ( &$data, $page_meta ) {
        if ( $this->is_feed && isset( $data['date'] ) ) {
            $data['date_modified'] = $page_meta['date_modified'];
            $data = $this->setAtomData( $data );
        }
    }

	public function get_pages ( &$pages ) {
		if ( $this->is_feed ) {

		    # merge json files
            foreach ( $this->json as $json ) {
                $data = $this->getJSON( $json );
                $pages = array_merge( $pages, $data );
            }

            # sort by date and date modified
            $sort = [];
            foreach ( $pages as $page ) {
                $sort['d'][] = $page['date'];
                $sort['m'][] = $page['date_modified'];
            }

            array_multisort( $sort['m'], SORT_DESC, $sort['d'], SORT_DESC, $pages );

            # feed entry limit
            $pages = array_slice( $pages, 0, self::ENTRY_LIMIT );
        }
	}

    /**
     * Get json and sort their items array by date.
     * @param $fileName
     * @return mixed
     */
    private function getJSON ( $fileName ) {
        $json = json_decode( file_get_contents( $this->content_dir . $fileName .'.json' ), true );
        $date_id = 0;
        $pages = [];

        foreach ( $json['items'] as $item ) {
            $item['url'] = $this->makeURL( isset( $item['url'] ) ? $item['url'] : null );
            $item['date_modified'] = !empty( $item['modified'] ) ? $item['modified'] : $item['date'];
            $atomData = $this->setAtomData( $item );
            $index = $atomData['date'] . 'b' . $date_id;
            $pages[ $index ] = $atomData;
            $date_id++;
        }

        return $pages;
    }

    private function makeURL ( $url ) {
        if ( !empty( $url ) ) {
            if ( empty( parse_url( $url, PHP_URL_SCHEME ) ) ) {
                return $this->base_url . '/' . ltrim( $url, '/' );
            }
        }
        return $this->base_url;
    }

	public function before_render ( &$twig_vars ) {
		if ( $this->is_feed ) {
            $twig_vars['feed_id'] = $this->makeAtomId();
            $twig_vars['feed_updated'] = $this->getNewestDate();
			header( $_SERVER['SERVER_PROTOCOL'].' 200 OK' ); // Override 404 header
			header( 'Content-Type: application/rss+xml; charset=UTF-8' );
			$loader = new Twig_Loader_Filesystem( dirname(__FILE__) );
			$twig_rss = new Twig_Environment( $loader, $twig_vars['config']['twig_config'] );
			echo $twig_rss->render( 'atom.html', $twig_vars );
			exit;
		}
	}

	private function setAtomData ( $data ) {
        $date = isset( $data['date'] ) ? $data['date'] : date( $data['date_formatted'] );
        $stamp = strtotime($date);
        $iso = $this->makeISODate( $date );

        if ( !empty( $data['url'] ) ) {
            $data['atom_id'] = $this->makeAtomId( $stamp, parse_url( $data['url'], PHP_URL_PATH ) );
            $data['date_iso'] = $iso;
        }
        if ( !empty( $data['date_modified'] ) ) {
            $stamp = strtotime( $data['date_modified'] );
            $data['date_modified_iso'] = $this->makeISODate( $data['date_modified'] );;
        } else {
            $data['date_modified_iso'] = $iso;
        }

        $this->setNewestDate( $stamp );

	    return $data;
    }

    private function setNewestDate ( $stamp ) {
        if ( !$this->newest || $this->newest < $stamp ) {
            $this->newest = $stamp;
        }
    }

    private function makeISODate ( $date ) {
        return date( 'Y-m-d\\T08:00:00+01:00', strtotime($date) );
    }

    private function makeAtomId ( $stamp = null, $slug = '' ) {
        $stamp = !$stamp ? time() : $stamp;
        return "tag:{$this->host},". date("Y-m-d", $stamp) .":$slug" ;
    }

    private function getNewestDate () {
        return date( 'Y-m-d\\T08:00:00+01:00', $this->newest );
    }
}