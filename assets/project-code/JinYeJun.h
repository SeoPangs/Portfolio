#pragma once

// Game Programmer Portfolio
class AJinYeJun : public Programmer
{
public:
    AJinYeJun();

    void BuildGameplaySystems();
    void SolveTechnicalProblems();
    void CollaborateWithTeam();

private:
    FString Role = "Game Programmer";
    FString MainEngine = "Unreal Engine";
    FString MainLanguage = "C++";

    TArray<FString> Interests = {
        "Gameplay Systems",
        "Data-Driven Architecture",
        "Player Experience"
    };
};
