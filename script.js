const ctx = document.getElementById('powerChart').getContext('2d');

const powerChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Power Usage (W)',
      data: [],
      borderColor: 'blue',
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    scales: {
      y: { beginAtZero: true },
      x: { title: { display: true, text: 'Time (s)' } }
    }
  }
});

let seconds = 0;
let totalEnergy = 0; // in kWh

function simulateData() {
  const power = Math.floor(Math.random() * 100) + 50; // Simulate power: 50W–150W

  // Update Chart
  powerChart.data.labels.push(seconds + "s");
  powerChart.data.datasets[0].data.push(power);
  if (powerChart.data.labels.length > 20) {
    powerChart.data.labels.shift();
    powerChart.data.datasets[0].data.shift();
  }
  powerChart.update();

  // Update units & cost
  const energyUsed = (power / 1000) * (1 / 3600); // W to kWh
  totalEnergy += energyUsed;

  document.getElementById('units').textContent = totalEnergy.toFixed(4);
  document.getElementById('cost').textContent = (totalEnergy * 7).toFixed(2);

  seconds++;
}

setInterval(simulateData, 1000); // every second

const appliances = [
  { name: "Fan", power: 0 },
  { name: "Light", power: 0 },
  { name: "TV", power: 0 }
];

function updateApplianceData() {
  const list = document.getElementById("applianceData");
  list.innerHTML = '';

  appliances.forEach(appliance => {
    // Simulate power value
    appliance.power = (Math.random() * 100).toFixed(2);
    const powerValue = appliance.power;

    const card = document.createElement("li");
    card.className = "appliance-card";

    card.innerHTML = `
      <div class="appliance-name">${appliance.name}</div>
      <div class="appliance-power">Power Usage: ${powerValue} W</div>
      <div class="progress-bar">
        <div class="progress-bar-inner" style="width: ${powerValue}%"></div>
      </div>
    `;

    list.appendChild(card);
  });
}

setInterval(updateApplianceData, 2000); // Update every 2 seconds

async function downloadBill() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const units = document.getElementById("units").textContent;
  const cost = document.getElementById("cost").textContent;

  const canvas = document.getElementById("powerChart");
  const chartImage = canvas.toDataURL("image/png");

  const logoImg = new Image();
  logoImg.src = "logo.png"; // Ensure logo.png is in your project folder
  logoImg.onload = function () {
    doc.addImage(logoImg, "PNG", 15, 10, 30, 30);

    doc.setFontSize(18);
    doc.text("WattWise Energy Bill", 50, 25);

    doc.setFontSize(14);
    doc.text(`Units Consumed: ${units} kWh`, 20, 50);
    doc.text(`Total Cost: ₹${cost}`, 20, 60);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);

    doc.addImage(chartImage, "PNG", 15, 80, 180, 60);

    doc.save("WattWise_Bill.pdf");
  };
}
