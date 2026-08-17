// Gameplay Ability activation
void UCombatComponent::TryAttack()
{
    if (!CanAttack()) return;

    FGameplayEventData EventData;
    EventData.EventTag = AttackTag;

    UAbilitySystemBlueprintLibrary::SendGameplayEventToActor(
        GetOwner(),
        AttackTag,
        EventData
    );
}
