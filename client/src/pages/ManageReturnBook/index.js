import React, { useState } from "react";
import ListManageReturnBookByStudentId from "../../components/ListManageReturnBookByStudentId";
import SearchByStudentId from "../../components/SearchByStudentId";
import BookStatus from "../../components/BookStatus";
import IdentifiBookCode from "../../components/IdentifiBookCode";
import ProgressBar from "../../components/ProgressBar";
function ManageReturnBook() {
  // Step state to track the progress
  const [currentStep, setCurrentStep] = useState(1);

  // Handler to update the step progress
  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 4)); // Increment step, max of 4
  };

  // Function to render the component based on the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SearchByStudentId onNextStep={handleNextStep} />;
      case 2:
        return <ListManageReturnBookByStudentId onNextStep={handleNextStep} />;
      case 3:
        return <IdentifiBookCode onNextStep={handleNextStep} />;
      case 4:
        return <BookStatus  />;
      default:
        return <SearchByStudentId onNextStep={handleNextStep} />;
    }
  };

  return (
    <div className="container mt-4">
      <h1>Manage Return Book</h1>
      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} totalSteps={4} />

      {/* Render the step based on currentStep value */}
      {renderStep()}
    </div>
  );
}

export default ManageReturnBook;
