import {tokens} from "./helper";

const Token = artifacts.require("./Token");

require('chai').use(require('chai-as-promised')).should();

contract("Token", ([deployer,receiver]) => {

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

    describe("Send the token", ()=>{

        it("it Should be transfer token", async()=>{
            let balanceOf;
            balanceOf = await token.balanceOf(deployer);
            console.log("balance of deployer before transfer: ", balanceOf.toString());
            balanceOf = await token.balanceOf(receiver);
            console.log("balance of receiver before transfer: ", balanceOf.toString());
            //transfer token
            await token.transfer(receiver, tokens(100), {from: deployer});
            balanceOf = await token.balanceOf(deployer);
            console.log("balance of deployer after transfer: ", balanceOf.toString());
            balanceOf = await token.balanceOf(receiver);
            console.log("balance of receiver after transfer: ", balanceOf.toString());
            // const result = await token.transfer(receiver, tokens(10));

            // result.logs[0].args._from.should.equal(deployer);
            // result.logs[0].args._to.should.equal(receiver);
            // result.logs[0].args._value.toString().should.equal(tokens(10).toString());
        })
    })
})