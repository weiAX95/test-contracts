const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // 1. 部署 YiDengToken
  const YiDengToken = await ethers.getContractFactory("YiDengToken");
  const yiDengToken = await YiDengToken.deploy();
  console.log("YiDengToken deployed to:", await yiDengToken.getAddress());

  // 2. 部署 CourseCertificate
  const CourseCertificate = await ethers.getContractFactory("CourseCertificate");
  const courseCertificate = await CourseCertificate.deploy();
  console.log("CourseCertificate deployed to:", await courseCertificate.getAddress());

  // 3. 部署 CourseMarket
  const CourseMarket = await ethers.getContractFactory("CourseMarket");
  const courseMarket = await CourseMarket.deploy(
    await yiDengToken.getAddress(),
    await courseCertificate.getAddress()
  );
  console.log("CourseMarket deployed to:", await courseMarket.getAddress());

  // 4. 部署 TechArticleDAO
  const TechArticleDAO = await ethers.getContractFactory("TechArticleDAO");
  const techArticleDAO = await TechArticleDAO.deploy(await yiDengToken.getAddress());
  console.log("TechArticleDAO deployed to:", await techArticleDAO.getAddress());

  // 5. 初始化代币分配
  console.log("Initializing token distribution...");
  await yiDengToken.distributeInitialTokens(
    deployer.address,
    deployer.address,
    deployer.address
  );
  console.log("Initial token distribution completed");

  // 检查当前总供应量
  const totalSupply = await yiDengToken.totalSupply();
  console.log("Current total supply:", totalSupply.toString());
  console.log("Max supply:", await yiDengToken.MAX_SUPPLY());

  // 6. 使用较少的 ETH 购买代币
  console.log("Buying tokens with ETH...");
  const TOKENS_PER_ETH = await yiDengToken.TOKENS_PER_ETH();
  console.log("TOKENS_PER_ETH:", TOKENS_PER_ETH.toString());
  const remainingSupply = await yiDengToken.remainingMintableSupply();
  const maxETH = remainingSupply / TOKENS_PER_ETH; // 最大可用的 ETH
  const ethAmount = ethers.parseEther("0.1") < (maxETH) ? ethers.parseEther("0.1") : maxETH;

// 购买代币
/* await yiDengToken.buyWithETH({ value: ethAmount });
console.log("Tokens purchased with adjusted ETH amount");

  await yiDengToken.buyWithETH({ value: ethAmount });
  console.log("Tokens purchased");

  7. 将代币转移给 TechArticleDAO
  console.log("Transferring tokens to TechArticleDAO...");
  const rewardAmount = ethers.parseUnits("50", "0"); // 减少到只转移 50 YD
  const balance = await yiDengToken.balanceOf(deployer.address);
  console.log("Current balance:", balance.toString());
  await yiDengToken.transfer(await techArticleDAO.getAddress(), rewardAmount);
  console.log("Transferred reward tokens to TechArticleDAO"); */


  // 打印最终地址和余额
  console.log("\nContract Addresses:");
  console.log("-------------------");
  console.log("YiDengToken:", await yiDengToken.getAddress());
  console.log("CourseCertificate:", await courseCertificate.getAddress());
  console.log("CourseMarket:", await courseMarket.getAddress());
  console.log("TechArticleDAO:", await techArticleDAO.getAddress());

   // 打印最终余额
  const daoBalance = await yiDengToken.balanceOf(await techArticleDAO.getAddress());
  console.log("\nFinal Balances:");
  console.log("---------------");
  console.log("Deployer YD Balance:", await yiDengToken.balanceOf(deployer.address));
  console.log("TechArticleDAO YD Balance:", daoBalance);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });