const { ethers } = require("hardhat");



async function main() {
    const FanteraToken = await ethers.getContractFactory("FanteraToken")
    const fanteraToken = await FanteraToken.deploy()

    await fanteraToken.deployed()

    console.log("FanteraToken deployed to :", fanteraToken.address);
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1
})