let baseUri = "ipfs://QmUJhBLChA1eNNu7WUXoJRRtLYMQr8zdDENgXR99wmv56m/"
const MAX_SUPPLY = 3

async function main() {
  const FanteraNFT = await ethers.getContractFactory("FanteraNFT");
  const fanteraNFT = await FanteraNFT.deploy(baseUri, MAX_SUPPLY);

  await fanteraNFT.deployed();

  console.log("fanteraNFT deployed to:", fanteraNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});