#include "ManausPlayerController.h"

AManausPlayerController::AManausPlayerController()
{
    bShowMouseCursor = false;
}

void AManausPlayerController::BeginPlay()
{
    Super::BeginPlay();
    SetInputMode(FInputModeGameOnly());
}

