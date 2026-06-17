using UnrealBuildTool;

public class ManausMetaverse : ModuleRules
{
    public ManausMetaverse(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

        PublicDependencyModuleNames.AddRange(new[]
        {
            "Core",
            "CoreUObject",
            "Engine",
            "InputCore",
            "EnhancedInput",
            "UMG",
            "AIModule",
            "NavigationSystem",
            "MassEntity",
            "MassCommon",
            "MassAI",
            "ChaosVehicles",
            "MotionWarping",
            "IKRig",
            "HTTP",
            "Json",
            "JsonUtilities"
        });
    }
}
