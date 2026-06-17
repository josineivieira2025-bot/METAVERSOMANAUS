#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "ManausPlayerController.generated.h"

UCLASS()
class MANAUSMETAVERSE_API AManausPlayerController : public APlayerController
{
    GENERATED_BODY()

public:
    AManausPlayerController();

protected:
    virtual void BeginPlay() override;
};

