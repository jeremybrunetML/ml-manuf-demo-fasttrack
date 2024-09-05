#!/bin/bash

env=$1

# echo "Evironment: $env"

# echo "Clearing all databases..."
 ./gradlew mlClearDatabase -PenvironmentName=$env -Pdatabase=data-hub-MODULES -Pconfirm=true
 ./gradlew mlClearDatabase -PenvironmentName=$env -Pdatabase=data-hub-JOBS -Pconfirm=true
 ./gradlew mlClearDatabase -PenvironmentName=$env -Pdatabase=data-hub-STAGING -Pconfirm=true
 ./gradlew mlClearDatabase -PenvironmentName=$env -Pdatabase=data-hub-FINAL -Pconfirm=true

# echo "Deploy Hub..."
./gradlew mlDeploy -PenvironmentName=$env -i

echo "Running Fournisseur Flow..."
./gradlew hubRunFlow -PenvironmentName=$env -PflowName=FournisseurFlow -i
echo "Running Maintenance Flow..."
./gradlew hubRunFlow -PenvironmentName=$env -PflowName=MaintenanceFlow -i
echo "Running Operation Flow..."
./gradlew hubRunFlow -PenvironmentName=$env -PflowName=OperationFlow -i
echo "Running Part Flow..."
./gradlew hubRunFlow -PenvironmentName=$env -PflowName=PartFlow -i
echo "Running Fournisseur flow..."
./gradlew hubRunFlow -PenvironmentName=$env -PflowName=PeopleFlow -i
