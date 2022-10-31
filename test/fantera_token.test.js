const { expect } = require("chai")
const { ethers } = require("hardhat")

const NAME = "FanteraToken"
const SYMBOL = "FTN"
const DECIMALS = 18

async function deployContract() {
    const signers = await ethers.getSigners()
    const FanteraToken = await ethers.getContractFactory("FanteraToken")
    const fanteraToken = await FanteraToken.deploy()

    await fanteraToken.deployed()

    return { fanteraToken, signers }
}

describe("FanteraToken", function() {
    let fanteraToken, signers

    describe("Deployment", function() {
        beforeEach(async function () {
            ({ fanteraToken, signers } = await deployContract())
        }) 
        
        it('Should have the correct name', async function () {
            expect(await fanteraToken.name()).to.equal(NAME)
        })
        
        it('Should have the correct symbol', async function () {
            expect(await fanteraToken.symbol()).to.equal(SYMBOL)
        })
        
        it('Should have the correct decimals', async function () {
            expect(await fanteraToken.decimals()).to.equal(DECIMALS)
        })
    })

    describe("transfers", function () {
        before(async function () {
            ({ fanteraToken, signers } = await deployContract())
        })
        
        it('Should mint and display correct balance and fire Approval and Transfer', async function () {
            let mintingUser = signers[0]
            const amount = ethers.BigNumber.from("10000000000000000")
            await expect(fanteraToken.connect(mintingUser).approve(fanteraToken.address, amount))
                .to.emit(fanteraToken, "Approval")
                .withArgs(mintingUser.address, fanteraToken.address, amount)
            await expect(fanteraToken.connect(mintingUser).mint(mintingUser.address, amount))
                .to.emit(fanteraToken, "Transfer", ethers.constants.AddressZero, mintingUser.address, amount)
            expect(await fanteraToken.balanceOf(mintingUser.address)).to.equal(amount)
        })

        it('Should transfer funds and display correct balance and fire Transfer', async function () {
            let fromUser = signers[0]
            let toUser = signers[1]
            const amount = ethers.BigNumber.from("10000000000000000")
            expect(await fanteraToken.balanceOf(fromUser.address)).to.equal(amount)
            expect(await fanteraToken.balanceOf(toUser.address)).to.equal(0)
            await expect(fanteraToken.connect(fromUser).transfer(toUser.address, amount))
                .to.emit(fanteraToken, "Transfer", fromUser.address, fromUser.address, amount)
            expect(await fanteraToken.balanceOf(fromUser.address)).to.equal(0)
            expect(await fanteraToken.balanceOf(toUser.address)).to.equal(amount)
        })
    })
})