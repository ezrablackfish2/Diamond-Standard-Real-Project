const NFTGAME_CONTRACT_ADDRESS = "0x2D4517D5f399FBA585ee92eC9F11961378384bf1";
const DYNAMIC_GAME_FACET_ADDRESS = "0x2D4517D5f399FBA585ee92eC9F11961378384bf1";
const STAKE_FACET_ADDRESS = "0x2D4517D5f399FBA585ee92eC9F11961378384bf1";

const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
        levels: characterData.levels
    }
}

export { NFTGAME_CONTRACT_ADDRESS, transformCharacterData, DYNAMIC_GAME_FACET_ADDRESS, STAKE_FACET_ADDRESS};
