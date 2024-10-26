import React, { useState } from "react";
import ListManageReturnBookByStudentId from "../../components/ListManageReturnBookByStudentId";
import SearchByStudentId from "../../components/SearchByStudentId";
import BookStatus from "../../components/BookStatus";
import IdentifiBookCode from "../../components/IdentifiBookCode";
import ProgressBar from "../../components/ProgressBar";
import Bill from "../../pages/Bill"
function ManageReturnBook() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userID, setUserID] = useState(""); // Store userID
  const [bookID, setBookID] = useState(""); // Store bookID

  // Handler to update the step progress and store the userID or bookID
  const handleNextStep = (id) => {
    if (currentStep === 1) {
      setUserID(id); // Save userID from step 1
    } else if (currentStep === 2) {
      setBookID(id); // Save bookID from step 2
    }
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 4)); // Increment step, max of 4
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1)); // Decrement step, min of 1
  };

  // Function to render the component based on the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SearchByStudentId onNextStep={handleNextStep} />;
      case 2:
        return (
          <ListManageReturnBookByStudentId
            userID={userID}
            onNextStep={handleNextStep}
            onPreviousStep={handlePreviousStep}
          />
        );
      // case 3:
      //   return (
      //     <IdentifiBookCode
      //       bookID={bookID} // Ensure bookID is passed correctly
      //       onNextStep={handleNextStep}
      //       onPreviousStep={handlePreviousStep}
      //     />
      //   );
      case 3:
        return <BookStatus bookID={bookID} onNextStep={handleNextStep} onPreviousStep={handlePreviousStep} />;
      case 4:
        return <Bill />
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
