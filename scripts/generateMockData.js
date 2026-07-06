import fs from 'fs';

const generateMockData = () => {
  const leads = [];
  const employees = ['Priya Singh', 'Amit Kumar', 'Neha Sharma', 'Rohan Desai', 'Vikram Singh'];
  const statuses = ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'];
  const courses = ['Full Stack Development', 'Data Science', 'UI/UX Design', 'Cloud Computing', 'Cyber Security'];
  const sources = ['Website', 'Referral', 'LinkedIn', 'Google Ads', 'Direct'];
  
  // Custom simple random generators to avoid adding faker dependency just for this
  const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomMobile = () => `9${Math.floor(100000000 + Math.random() * 900000000)}`;
  
  const firstNames = ['Rahul', 'Priya', 'Amit', 'Neha', 'Rohan', 'Vikram', 'Anjali', 'Karan', 'Sneha', 'Arjun', 'Pooja', 'Deepak', 'Kavita', 'Suresh', 'Divya'];
  const lastNames = ['Sharma', 'Singh', 'Kumar', 'Desai', 'Patel', 'Verma', 'Gupta', 'Joshi', 'Mehta', 'Rao', 'Reddy', 'Nair', 'Das', 'Roy', 'Chauhan'];
  
  const randomName = () => `${randomElement(firstNames)} ${randomElement(lastNames)}`;
  const randomDate = () => {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  };

  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

  for (let i = 1; i <= 75; i++) {
    const notesCount = Math.floor(Math.random() * 4); // 0 to 3 notes
    const notes = [];
    
    for (let j = 0; j < notesCount; j++) {
      notes.push({
        id: crypto.randomUUID(),
        content: `Discussed regarding ${randomElement(courses)} course details and schedule.`,
        createdDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        createdBy: randomElement(employees)
      });
    }

    const name = randomName();
    const email = `${name.split(' ')[0].toLowerCase()}.${name.split(' ')[1].toLowerCase()}@example.com`;

    leads.push({
      id: i.toString(),
      name,
      mobile: randomMobile(),
      email,
      address: randomElement(cities),
      courseInterested: randomElement(courses),
      leadSource: randomElement(sources),
      assignedEmployee: randomElement(employees),
      status: randomElement(statuses),
      createdDate: randomDate(),
      notes: notes
    });
  }

  const db = { leads };

  fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
  console.log('Mock data generated in db.json');
};

generateMockData();
