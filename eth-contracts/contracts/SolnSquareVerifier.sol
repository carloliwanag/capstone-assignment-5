pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract VerifierInterface {
    function verifyTx(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[2] calldata input
    ) external returns (bool r);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {
    VerifierInterface verifier;

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address solutionAddress;
        bool exists;
    }

    // TODO define an array of the above struct
    Solution[] solutionsArr;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) solutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address solutionAddress);

    constructor(address verifierAddress) public {
        verifier = VerifierInterface(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(bytes32 _hash) public {
        uint256 _index = solutionsArr.length;

        Solution memory newSolution = Solution({
            solutionAddress: msg.sender,
            exists: true,
            index: _index
        });
        solutionsArr.push(newSolution);
        solutions[_hash] = newSolution;

        emit SolutionAdded(_index, msg.sender);
    }

    function hashData(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(a, b, c, input));
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        bytes32 _hash = hashData(a, b, c, input);
        require(!solutions[_hash].exists, "Solution has been submitted");
        require(verifier.verifyTx(a, b, c, input), "Proof invalid");

        addSolution(_hash);

        mint(msg.sender, tokenId, "");
    }
}
