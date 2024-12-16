import * as fs from 'fs';
import * as path from 'path';

// 配置
const ARTIFACTS_PATH = './artifacts/contracts';
const OUTPUT_PATH = './frontend/src/abi'; // 可以根据你的前端项目路径修改

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
}

// 遍历 artifacts 目录
function extractAbis() {
    try {
        // 检查 artifacts 目录是否存在
        if (!fs.existsSync(ARTIFACTS_PATH)) {
            console.error('Artifacts directory not found. Please run "npx hardhat compile" first.');
            return;
        }

        const artifactsDir = fs.readdirSync(ARTIFACTS_PATH);
        
        artifactsDir.forEach(file => {
            const contractDir = path.join(ARTIFACTS_PATH, file);
            
            // 只处理 .sol 目录
            if (fs.statSync(contractDir).isDirectory()) {
                const jsonFiles = fs.readdirSync(contractDir);
                
                jsonFiles.forEach(jsonFile => {
                    if (jsonFile.endsWith('.json') && !jsonFile.endsWith('.dbg.json')) {
                        const jsonPath = path.join(contractDir, jsonFile);
                        const contractData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                        
                        // 检查是否存在 ABI
                        if (contractData && contractData.abi) {
                            // 提取合约名称和 ABI
                            const contractName = path.basename(jsonFile, '.json');
                            const abi = contractData.abi;
                            
                            // 保存 ABI 到单独的文件
                            const outputFile = path.join(OUTPUT_PATH, `${contractName}.json`);
                            fs.writeFileSync(outputFile, JSON.stringify(abi, null, 2));
                            
                            console.log(`Successfully extracted ABI for ${contractName} to ${outputFile}`);
                        } else {
                            console.warn(`No ABI found in ${jsonPath}`);
                        }
                    }
                });
            }
        });

        console.log('\nABI extraction completed!');
    } catch (error) {
        console.error('Error during ABI extraction:', error);
    }
}

extractAbis();