<?php
App::uses('MediaAppModel', 'Media.Model');

/**
 * Media Gallery Model.
 * 
 * Metadata for a collection of Media
 * 
 */

class AppMediaGallery extends MediaAppModel {
		
	public $name = 'MediaGallery';
	public $actsAs = array('Media.MediaAttachable');
	
	 public $hasOne = array(
        'Thumbnail' => array(
            'className' => 'Media.Media',
        	'foreignKey' => false,
            'conditions' => array('Thumbnail.id' => 'MediaGallery.thumbail'),
            'dependent' => true
        )
    );
	 
	 public $belongsTo = array(
 		'Creator' => array(
 				'className' => 'Users.User',
 				'foreignKey' => 'creator_id',
 		),
 		'Modifier' => array(
 				'className' => 'Users.User',
 				'foreignKey' => 'modifier_id',
 		)
	 );
	
	
	/**
	 * Duplicates an entire gallery, that will be owned by the current logged in user.
	 * 
	 * @param char $galleryId
	 */
	public function duplicate($galleryId) {
		$mediaGallery = $this->find('first', array(
			'conditions' => array('id' => $galleryId)
		));
		
		// create a clone for this user
		$mediaGallery['MediaGallery']['id'] = null;
		$mediaGallery['MediaGallery']['creator_id'] = $mediaGallery['MediaGallery']['modifier_id'] = $this->userId;
		foreach ($mediaGallery['Media'] as &$media) {
			$media['creator_id'] = $media['modifier_id'] = $this->userId;
			$media['MediaAttachment']['creator_id'] = $media['MediaAttachment']['modifier_id'] = $this->userId;
		}

		if (!$this->saveAll($mediaGallery)) {
			throw new Exception("Error Processing Request", 1);
		}
		return $this->id;
	}

/**
 * Generates a MediaGallery with $options['Media'] number of attached media
 */
	public function generate($options) {
		// create gallery
		$newGallery = $this->create(array(
			'title' => 'Untitled'
		));
		$this->save($newGallery);
		
		// create a Media row foreach page
		$mediaToGenerate = $options['Media'];
		for ($i=0; $i < $mediaToGenerate; $i++) {
			$this->Media->create();
			$this->Media->save(array(
				'Media' => array(
					'filename' => '',
					'model' => 'Media'
				)
			), array('callbacks' => false));
			if ($i === 0) {
				// store the first page's id (Media.order), so we can redirect them later
				$firstMediaId = $this->Media->id;
			}
			$this->Media->MediaAttachment->create();
			$this->Media->MediaAttachment->save(array(
				'MediaAttachment' => array(
					'model' => 'MediaGallery',
					'foreign_key' => $this->id,
					'media_id' => $this->Media->id,
					'creator_id' => $this->userId,
					'modifier_id' => $this->userId,
					'order' => $i
				)
			), array('callbacks' => false));
		}
		
		return $firstMediaId;
	}
	
}

if (!isset($refuseInit)) {
	class MediaGallery extends AppMediaGallery {}
}
