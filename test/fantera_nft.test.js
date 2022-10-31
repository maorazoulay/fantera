const { expect } = require("chai")
const { ethers } = require("hardhat")

let baseUri = "ipfs://QmUJhBLChA1eNNu7WUXoJRRtLYMQr8zdDENgXR99wmv56m/"
const BASE_EXTENSION = ".json"
const NAME = "Fantera NFT"
const SYMBOL = "FAN"
const MAX_SUPPLY = 3
const MINT_PRICE = 0.001

async function deployContract() {
    const signers = await ethers.getSigners()
    const FanteraNFT = await ethers.getContractFactory("FanteraNFT");
    const fanteraNFT = await FanteraNFT.deploy(baseUri, MAX_SUPPLY);

    await fanteraNFT.deployed()

    return { fanteraNFT, signers }
}

describe("fanteraNFT", function() {
    let fanteraNFT, signers

    describe("Deployment", function() {
        beforeEach(async function () {
            ({ fanteraNFT, signers } = await deployContract())
        }) 
        
        it('Should have the correct name', async function () {
            expect(await fanteraNFT.name()).to.equal(NAME)
        })
        
        it('Should have the correct symbol', async function () {
            expect(await fanteraNFT.symbol()).to.equal(SYMBOL)
        })
        
    })

    describe("mint", function () {
        before(async function () {
            ({ fanteraNFT, signers } = await deployContract())
        })
        
        it('Should mint and display correct balance and fire Transfer event', async function () {
            let mintCount = 1
            let totalMintPrice = getTotalMintPrice(mintCount, MINT_PRICE)
            let mintingUser = signers[0]

            expect(await fanteraNFT.connect(mintingUser).mint(mintCount, {value: totalMintPrice}))
                .to.emit(fanteraNFT, "Transfer")
                .withArgs(ethers.constants.AddressZero, mintingUser.address, 1)
            expect(await fanteraNFT.connect(mintingUser).balanceOf(mintingUser.address))
                .to.equal(mintCount)
        })
    })
})

function getTotalMintPrice(tokenAmount, mintPrice) {
    return ethers.utils.parseEther((tokenAmount * mintPrice).toString())
}