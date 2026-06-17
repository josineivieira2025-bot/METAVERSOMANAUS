#include "ManausGameMode.h"
#include "ManausPlayerCharacter.h"
#include "ManausPlayerController.h"

AManausGameMode::AManausGameMode()
{
    DefaultPawnClass = AManausPlayerCharacter::StaticClass();
    PlayerControllerClass = AManausPlayerController::StaticClass();
}

