// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
contract Memory {
    uint public countImageTotal = 0;
    struct Image {
        uint id;
        string hash;
        bool completed;
    }
    mapping (uint => Image) private images;
    mapping(address=> uint[]) private authorToImage;
    event ImageUploaded(
        uint id,
        string hash,
        bool completed
    );
    event startOverEvent(
        
    );
    event completed1Image(
        uint id
    );
    constructor()  {

    }
    function getAuthorToImage() private view returns (uint[] memory){
        return authorToImage[msg.sender];
    }
    function complete1Image(uint _id) public {
        images[_id].completed = !images[_id].completed;
        emit completed1Image(_id);
    }
    function startOver() public {
        uint[] memory ImageOfThisAuthor=getAuthorToImage();
        for (uint i = 1;i<=ImageOfThisAuthor.length;i++ ){
            images[ImageOfThisAuthor[i-1]].completed = false ;
        }
        emit startOverEvent();


    }
    function getImages() public view returns ( Image[] memory ){
        // Image[] memory i;
        // return i;
        uint[] memory ImageOfThisAuthor=getAuthorToImage();
        Image[] memory ImageForArray = new Image[](ImageOfThisAuthor.length);
        for (uint i = 1;i<=ImageOfThisAuthor.length;i++ ){
            ImageForArray[i-1] = images[ImageOfThisAuthor[i-1]];
        }
        return (ImageForArray);
    }
   
    function uploadImage(string memory _imageHash) public {
    // Make sure the video hash exists
    require(bytes(_imageHash).length>0);
    
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment video id
    
    countImageTotal++;
    authorToImage[msg.sender].push(countImageTotal);
    // Add video to the contract
    images[countImageTotal] = Image(countImageTotal,_imageHash,false);
    // Trigger an event
    emit ImageUploaded(countImageTotal, _imageHash, false);
  }

}