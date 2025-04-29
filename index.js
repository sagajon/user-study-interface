const trials = [
  ["Sphere_S5P1", "Sphere_S5P2"],
  ["Sphere_S5P1", "Sphere_S5P3"],
  ["Sphere_S5P1", "Sphere_S5P4"],
  ["Sphere_S5P1", "Sphere_S10P1"],
  ["Sphere_S5P2", "Sphere_S5P3"],
  ["Sphere_S5P2", "Sphere_S5P4"],
  ["Sphere_S5P2", "Sphere_S10P2"],
  ["Sphere_S5P3", "Sphere_S5P4"],
  ["Sphere_S5P3", "Sphere_S10P3"],
  ["Sphere_S5P4", "Sphere_S10P4"],
  ["Sphere_S10P1", "Sphere_S10P2"],
  ["Sphere_S10P1", "Sphere_S10P3"],
  ["Sphere_S10P1", "Sphere_S10P4"],
  ["Sphere_S10P2", "Sphere_S10P3"],
  ["Sphere_S10P2", "Sphere_S10P4"],
  ["Sphere_S10P3", "Sphere_S10P4"],
  ["Tree_S5P1", "Tree_S5P2"],
  ["Tree_S5P1", "Tree_S5P3"],
  ["Tree_S5P1", "Tree_S5P4"],
  ["Tree_S5P1", "Tree_S10P1"],
  ["Tree_S5P2", "Tree_S5P3"],
  ["Tree_S5P2", "Tree_S5P4"],
  ["Tree_S5P2", "Tree_S10P2"],
  ["Tree_S5P3", "Tree_S5P4"],
  ["Tree_S5P3", "Tree_S10P3"],
  ["Tree_S5P4", "Tree_S10P4"],
  ["Tree_S10P1", "Tree_S10P2"],
  ["Tree_S10P1", "Tree_S10P3"],
  ["Tree_S10P1", "Tree_S10P4"],
  ["Tree_S10P2", "Tree_S10P3"],
  ["Tree_S10P2", "Tree_S10P4"],
  ["Tree_S10P3", "Tree_S10P4"],
  ["House_S5P1", "House_S5P2"],
  ["House_S5P1", "House_S5P3"],
  ["House_S5P1", "House_S5P4"],
  ["House_S5P1", "House_S10P1"],
  ["House_S5P2", "House_S5P3"],
  ["House_S5P2", "House_S5P4"],
  ["House_S5P2", "House_S10P2"],
  ["House_S5P3", "House_S5P4"],
  ["House_S5P3", "House_S10P3"],
  ["House_S5P4", "House_S10P4"],
  ["House_S10P1", "House_S10P2"],
  ["House_S10P1", "House_S10P3"],
  ["House_S10P1", "House_S10P4"],
  ["House_S10P2", "House_S10P3"],
  ["House_S10P2", "House_S10P4"],
  ["House_S10P3", "House_S10P4"],
];

const trialOrder = [...trials.keys()];
shuffleArray(trialOrder);
const numTrials = trials.length;
let currentTrialIndex = -1;
const pageDelay = 0; // 5000
const trialDelay = 0; // 1000
let startTime = new Date();
let results = [];

setTimeout(() => $("#continueButton").prop("disabled", false), pageDelay);

// if (window.screen.height < 100 || window.screen.width < 50) {
//   $("#consentPage").hide();
//   $("#screenSizeWarning").show();
//   $("#screenSize").text(
//     `Your current screen size is ${window.screen.width}x${window.screen.height}.`
//   );
// }
$("#knowledgePage").hide();

function continueButtonPressed() {
  $("#consentPage").hide();
  $("#knowledgePage").show();
  $("#welcomeHeading").hide();
  setTimeout(() => $("#knowledgeButton").prop("disabled", false), pageDelay);
}

function knowledgeButtonPressed() {
  $("#knowledgePage").hide();
  $("#instructionPage").show();
  $("#welcomeHeading").hide();
  setTimeout(() => $("#startButton").prop("disabled", false), pageDelay);
}

function startButtonPressed() {
  $("#instructionPage").hide();
  $("#referencePage").show();
  setTimeout(() => $("#trialStartButton").prop("disabled", false), pageDelay);
}

function trialStartButtonPressed() {
  $("#referencePage").hide();
  startTrials();
}

function startTrials() {
  $("#trialPage").show();
  setButtonEnableTimer("realismButton", trialDelay);
  nextTrial();
}

function realismSubmit(button) {
  setButtonEnableTimer("realismButton", trialDelay);
  results.push(getTrialResult(button));
  nextTrial();
}

function getTrialResult(button) {
  let imageString = "";
  if (button === "Option 1") {
    imageString = $("#leftImage").attr("src");
  } else {
    imageString = $("#rightImage").attr("src");
  }
  return {
    trialNum: trialOrder[currentTrialIndex],
    selectedImage: imageString.substring(4, imageString.length - 4),
    selectedButton: button,
  };
}

function nextTrial() {
  currentTrialIndex += 1;
  if (currentTrialIndex >= numTrials) {
    finishTrials();
  } else {
    $("#trialNumber").text(`Trial ${currentTrialIndex + 1}`);

    const leftModel = document.getElementById("leftImage");
    const rightModel = document.getElementById("rightImage");

    if (Math.random() < 0.5) {
      leftModel.setAttribute(
        "src",
        `models/${trials[trialOrder[currentTrialIndex]][0]}.glb`
      );
      rightModel.setAttribute(
        "src",
        `models/${trials[trialOrder[currentTrialIndex]][1]}.glb`
      );
    } else {
      leftModel.setAttribute(
        "src",
        `models/${trials[trialOrder[currentTrialIndex]][1]}.glb`
      );
      rightModel.setAttribute(
        "src",
        `models/${trials[trialOrder[currentTrialIndex]][0]}.glb`
      );
    }
  }
}

function finishTrials() {
  $("#trialPage").hide();
  $("#demographicsPage").show();
}

function verifyAndGatherData() {
  let potentialAge = parseInt($("input[name=age]").val(), 10);
  let potentialCountry = $("input[name=country]").val();

  if (Number.isInteger(potentialAge) && potentialCountry) {
    let data = {
      gender: $("select[name=gender]").find(":selected").text(),
      age: potentialAge,
      education: $("select[name=education]").find(":selected").text(),
      country: potentialCountry,
      experience: $("select[name=experience]").find(":selected").text(),
      vision: $("select[name=vision]").find(":selected").text(),
      comments: $("textarea[name=comments]").val(),
      duration: 0.001 * (new Date() - startTime),
      trialResults: results,
    };

    $("input[name=Data]").val(JSON.stringify(data));
    $("#dataForm").submit();
    $("#demographicsPage").hide();
  } else {
    alert("Incorrect data, correct any errors and try again.");
  }
}

function setButtonEnableTimer(className, delay) {
  $(`.${className}`).prop("disabled", true);
  setTimeout(() => $(`.${className}`).prop("disabled", false), delay);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
