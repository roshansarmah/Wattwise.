let seconds = 0;
let totalEnergy = 0;
let dailyData = {};
let currentDay = new Date().toLocaleDateString();

const appliances = [
  { name: "Fan", power: 0 },
  { name: "Light", power: 0 },
  { name: "TV", power: 0 }
];

function simulateData() {
  const now = new Date();
  const today = now.toLocaleDateString();

  if (today !== currentDay) {
    dailyData[currentDay] = {
      energy: totalEnergy,
      cost: totalEnergy * 7
    };
    totalEnergy = 0;
    currentDay = today;
  }

  const power = Math.floor(Math.random() * 100) + 50;
  const energyUsed = (power / 1000) * (1 / 3600);
  totalEnergy += energyUsed;

  document.getElementById("livePower").textContent = power;
  document.getElementById("liveEnergy").textContent = totalEnergy.toFixed(4);
  document.getElementById("units").textContent = totalEnergy.toFixed(4);
  document.getElementById("cost").textContent = (totalEnergy * 7).toFixed(2);

  if (!dailyData[today]) dailyData[today] = { energy: 0, cost: 0 };
  dailyData[today].energy += energyUsed;
  dailyData[today].cost = dailyData[today].energy * 7;

  seconds++;
}

setInterval(simulateData, 1000);

function updateApplianceData() {
  const list = document.getElementById("applianceData");
  list.innerHTML = '';

  appliances.forEach(appliance => {
    appliance.power = (Math.random() * 100).toFixed(2);

    const card = document.createElement("li");
    card.className = "appliance-card";
    card.innerHTML = `
      <div><strong>${appliance.name}</strong></div>
      <div>Power Usage: ${appliance.power} W</div>
      <div class="progress-bar">
        <div class="progress-bar-inner" style="width: ${appliance.power}%"></div>
      </div>
    `;
    list.appendChild(card);
  });
}

setInterval(updateApplianceData, 2000);

function updateDailyBillView() {
  const list = document.getElementById("dailyBillList");
  list.innerHTML = '';

  for (const day in dailyData) {
    const li = document.createElement("li");
    li.textContent = `${day} - ${dailyData[day].energy.toFixed(2)} kWh - ₹${dailyData[day].cost.toFixed(2)}`;
    list.appendChild(li);
  }
}

setInterval(updateDailyBillView, 60000);

function downloadBill() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  const billId = `WTW-${Math.floor(100000 + Math.random() * 900000)}`;
  const ratePerUnit = 17;
  const totalCost = (totalEnergy * ratePerUnit).toFixed(2);
  const totalUnits = totalEnergy.toFixed(4);

  const appliancesList = appliances.map(app => ({
    name: app.name,
    power: parseFloat(app.power).toFixed(2)
  }));

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text("WattWise", 15, 20);
  doc.setLineWidth(0.5);
  doc.line(15, 24, 195, 24);

  const logoUrl = "https://img.icons8.com/ios-filled/100/electricity.png";
  doc.addImage(logoUrl, 'PNG', 180, 10, 10, 10);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Billing ID: ${billId}`, 15, 32);
  doc.text(`Date: ${date}`, 15, 38);
  doc.text(`Time: ${time}`, 15, 44);
  doc.text(`Customer: Roshan Sarmah`, 15, 50);
  doc.text(`Address: RVCE Campus, Bangalore, India`, 15, 56);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text("Appliance-wise Usage", 15, 70);

  doc.setFontSize(12);
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 75, 180, 10, 'F');
  doc.text("Appliance", 20, 82);
  doc.text("Power (W)", 150, 82);

  let y = 92;
  doc.setFont('helvetica', 'normal');
  appliancesList.forEach(app => {
    doc.text(app.name, 20, y);
    doc.text(`${app.power} W`, 150, y);
    y += 8;
  });

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text("Summary", 15, y);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  y += 8;
  doc.text(`Total Units: ${totalUnits} kWh`, 15, y);
  y += 7;
  doc.text(`Rate per Unit: Rs ${ratePerUnit}`, 15, y);
  y += 7;
  doc.text(`Total Amount: Rs ${totalCost}`, 15, y);

  y += 12;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text("Thank you for using WattWise – Smart Power Monitoring", 15, y);

  doc.save(`WattWise_Bill_${date.replaceAll('/', '-')}.pdf`);
}

document.getElementById("downloadBillBtn").addEventListener("click", downloadBill);
