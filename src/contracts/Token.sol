pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token{
    using SafeMath for uint;
    string  public name = "DApp Token";
    string public symbol = "DApp";
    uint256 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor()public{
        totalSupply = 1000000 *(10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner , address indexed spender, uint256 value);

    function transfer(address _to , uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);  
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function _transfer(address _from , address _to, uint256 _value) internal returns (bool success){
        require(_to != address(0)); 
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(_from,_to, _value);
        return true;
    }

    function approve(address spender, uint256 _value) public returns (bool success){
        require(spender != address(0));

        allowance[msg.sender][spender] = allowance[msg.sender][spender].add(_value);
        
        emit Approval(msg.sender, spender, _value);

        return true;
    }


    function transferFrom(address from, address to , uint256 value) public returns (bool succes){
        require(balanceOf[from] >= value);
        require(allowance[from][msg.sender] >= value);
        allowance[from][msg.sender] = allowance[from][msg.sender].sub(value);
        _transfer(from, to, value);
        return true;
    }



}