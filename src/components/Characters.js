import React from "react";

const charactersList = [
    { id: 1, name: "Calm", description: "Peaceful and relaxed temperament" },
    { id: 2, name: "Active", description: "High energy and playful" },
    { id: 3, name: "Love Sleep", description: "Enjoys resting and relaxing" },
    { id: 4, name: "Friendly", description: "Gets along well with others" },
    { id: 5, name: "Independent", description: "Self-reliant and confident" },
    { id: 6, name: "Protective", description: "Watchful and loyal" },
    { id: 7, name: "Curious", description: "Loves exploring new things" },
    { id: 8, name: "Gentle", description: "Soft and careful with others" },
    { id: 9, name: "Playful", description: "Always ready for fun" },
    { id: 10, name: "Social", description: "Loves meeting new friends" }
];

const Characters = ({ selectedCharacters, setSelectedCharacters }) => {
    const handleCharacterSelect = (character) => {
        if (selectedCharacters.includes(character)) {
            setSelectedCharacters(prev => prev.filter(c => c !== character));
        } else if (selectedCharacters.length < 3) {
            setSelectedCharacters(prev => [...prev, character]);
        }
    };

    return (
        <div className="characters-container">
            <div className="content-wrapper">
                <h1 className="page-title">Characters</h1>
                <div className="character-grid">
                    {charactersList.map((character) => (
                        <button
                            key={character.id}
                            className={`character-card ${
                                selectedCharacters.includes(character) ? 'selected' : ''
                            } ${
                                selectedCharacters.length >= 3 &&
                                !selectedCharacters.includes(character) ? 'disabled' : ''
                            }`}
                            onClick={() => handleCharacterSelect(character)}
                        >
                            {character.name}
                        </button>
                    ))}
                </div>
                <p className="selection-counter">
                    {selectedCharacters.length}/3
                </p>
            </div>
        </div>
    );
};

export default Characters;
