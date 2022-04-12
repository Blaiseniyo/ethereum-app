import {tokens , VMError} from "./helper";

const Token = artifacts.require("./Token");

require('chai').use(require('chai-as-promised')).should();

contract("Token", ([deployer,receiver,spender]) => {

    let token;
    const name = "DApp Token";
    const symbol = "DApp";
    const decimals = "18"
    const totalSupply = tokens(1000000).toString();

    beforeEach(async()=>{
        token = await Token.new()
    })

    describe("deployment", () => {
       
        it("tracks the name", async()=>{
           const result = await token.name();

           result.should.equal(name);
        })
        
        it("tracks the symbol", async()=>{
            const result = await token.symbol();
 
            result.should.equal(symbol);
         })

         it("tracks the name", async()=>{
            const result = await token.decimals();
 
            result.toString().should.equal(decimals);
         })

         it("tracks the name", async()=>{
            const result = await token.totalSupply();
 
            result.toString().should.equal(totalSupply);
         })

         it("It assigns the Total supply to the deployer", async()=>{
            const result = await token.balanceOf(deployer);

            result.toString().should.equal(totalSupply);
         })
    })

    describe("success", () => {
        describe("Transfer tokens", ()=>{
            let result;
            let amount = tokens(100);
            beforeEach(async()=>{
                result = await token.transfer(receiver, amount, {from: deployer})
            })
    
            it("it Should be transfer token", async()=>{
                let balanceOf;
                balanceOf = await token.balanceOf(deployer);
                balanceOf.toString().should.equal(tokens(999900).toString());
    
                balanceOf = await token.balanceOf(receiver);
                balanceOf.toString().should.equal(tokens(100).toString());
                
            })
    
            it("it emits a Transfer event", async()=>{
    
                result.logs[0].event.should.equal("Transfer");
                result.logs[0].args.from.should.equal(deployer);
                result.logs[0].args.to.should.equal(receiver);
                result.logs[0].args.value.toString().should.equal(amount.toString());
            })
        })
    })

    describe("failure", () => {


        it("rejects insufficient funds", async()=>{
            let invalidAmount;

            invalidAmount = tokens(100000000000);
            await token.transfer(receiver, invalidAmount, {from: deployer}).should.be.rejected;

            invalidAmount = tokens(100);
            await token.transfer(deployer, invalidAmount, {from: receiver}).should.be.rejected;
        })

        it("rejects an invalid address", async()=>{
            let amount = tokens(100);
            await token.transfer(0x0, amount, {from: deployer}).should.be.rejected;
        })
    })


    describe("Transfer Token", ()=>{


        describe("success", async()=>{
            
            let result;
            let amount;
            let allowance;
    
            beforeEach(async()=>{
                amount = tokens(100);
                result =  await token.approve(spender, amount, {from: deployer})
            })
    
            it("emit the Approval Event", async()=>{
                result.logs[0].event.should.equal("Approval");
                result.logs[0].args.owner.should.equal(deployer);
                result.logs[0].args.spender.should.equal(spender);
                result.logs[0].args.value.toString().should.equal(amount.toString());
            })
    
            it("it should send the allowance token to the spender", async()=>{
                
                allowance = await token.allowance(deployer, spender);
                allowance.toString().should.equal(amount.toString());
            })

            describe("Transfer Tokens ", ()=>{
                beforeEach(async()=>{
                    result = await token.transferFrom(deployer, receiver, amount, {from: spender});
                })
    
        
                it("it should transfer the token from the spender to the receiver", async()=>{
                    
                    allowance = await token.allowance(deployer, spender);
                    allowance.toString().should.equal("0");
        
                })
        
                it("it should emit a Transfer event", async()=>{
                    
                    result.logs[0].event.should.equal("Transfer");
                    result.logs[0].args.from.should.equal(deployer);
                    result.logs[0].args.to.should.equal(receiver);
                    result.logs[0].args.value.toString().should.equal(amount.toString());
                })
            })
        })

        describe("failure", async()=>{
            let amount;
            let result;
            beforeEach(async()=>{
                amount = tokens(10000000000);
                await token.approve(spender, amount, {from: deployer})
            })

            it("It should not send token unvailable tokens ", async()=>{
                await token.transferFrom(deployer, receiver, amount, {from: spender}).should.be.rejectedWith(VMError);
            })

            it("It should not send tokens to an unknown receiver", async()=>{
                await token.transferFrom(deployer, 0x0, amount, {from: spender}).should.be.rejected;
            })

           
        })
    })
})