const { assert } = require('chai')

const Memory = artifacts.require('./Memory.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Memory', ([deployer, author]) => {
  let image

  before(async () => {
    image = await Memory.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await image.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

   
  })

  describe('images', async () => {
    let result, imageCount
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    before(async () => {
      result = await image.uploadImage(hash, { from: author })
      imageCount = await image.countImageTotal()
    })

    //check event
    it('creates image', async () => {
      // SUCESS
      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      

      // FAILURE: Video must have hash
      await image.uploadImage('', { from: author }).should.be.rejected;

      
    })

    //check from Struct

    it('lists images of 1 author', async () => {
      let image2 = await image.getImages({from:author})
      assert.equal(image2[0].id, imageCount.toNumber(), 'id is correct')
      assert.equal(image2[0].hash, hash, 'Hash is correct')
      // result = await image.complete1Image(imageCount.toNumber(), { from: author })
      // image2 = await image.getImages({from:author})
      // console.log(image2)
    })
    it('compelte first image',async() =>{
      result = await image.complete1Image(imageCount.toNumber(), { from: author })
      let image2 = await image.getImages({from:author})
      assert.equal(image2[0].completed, true, 'complete is correct')
    })
    it('start over',async() =>{
      result = await image.startOver({ from: author })
      let image2 = await image.getImages({from:author})
      assert.equal(image2[0].completed, false, 'complete is correct')
    })
    
  })
})