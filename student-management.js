document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial Mock Student Dataset
  const INITIAL_STUDENTS = [
    {
      id: "std-001",
      rollNo: "CS202401",
      name: "Aarav Sharma",
      dept: "Computer Science",
      sem: "Semester 5",
      email: "aarav.sharma@college.edu",
      gpa: 3.92,
      attendance: 94.5,
      status: "Active"
    },
    {
      id: "std-002",
      rollNo: "CS202402",
      name: "Diya Patel",
      dept: "Computer Science",
      sem: "Semester 5",
      email: "diya.patel@college.edu",
      gpa: 3.88,
      attendance: 91.0,
      status: "Active"
    },
    {
      id: "std-003",
      rollNo: "IT202401",
      name: "Rohan Verma",
      dept: "Information Tech",
      sem: "Semester 3",
      email: "rohan.v@college.edu",
      gpa: 3.75,
      attendance: 88.2,
      status: "Active"
    },
    {
      id: "std-004",
      rollNo: "EC202401",
      name: "Ananya Iyer",
      dept: "Electronics & Comm",
      sem: "Semester 7",
      email: "ananya.i@college.edu",
      gpa: 3.95,
      attendance: 96.8,
      status: "Active"
    },
    {
      id: "std-005",
      rollNo: "ME202401",
      name: "Kabir Singh",
      dept: "Mechanical Eng",
      sem: "Semester 3",
      email: "kabir.singh@college.edu",
      gpa: 3.42,
      attendance: 82.0,
      status: "Active"
    },
    {
      id: "std-006",
      rollNo: "CE202401",
      name: "Priya Nair",
      dept: "Civil Engineering",
      sem: "Semester 5",
      email: "priya.nair@college.edu",
      gpa: 3.68,
      attendance: 89.5,
      status: "Active"
    },
    {
      id: "std-007",
      rollNo: "CS202403",
      name: "Vihaan Gupta",
      dept: "Computer Science",
      sem: "Semester 1",
      email: "vihaan.g@college.edu",
      gpa: 3.50,
      attendance: 76.4,
      status: "Probation"
    },
    {
      id: "std-008",
      rollNo: "IT202402",
      name: "Isha Malhotra",
      dept: "Information Tech",
      sem: "Semester 7",
      email: "isha.m@college.edu",
      gpa: 3.82,
      attendance: 93.0,
      status: "Active"
    },
    {
      id: "std-009",
      rollNo: "EC202402",
      name: "Siddharth Rao",
      dept: "Electronics & Comm",
      sem: "Semester 3",
      email: "siddharth.r@college.edu",
      gpa: 3.20,
      attendance: 79.5,
      status: "On Leave"
    },
    {
      id: "std-010",
      rollNo: "CS202404",
      name: "Meera Joshi",
      dept: "Computer Science",
      sem: "Semester 5",
      email: "meera.j@college.edu",
      gpa: 3.96,
      attendance: 97.5,
      status: "Active"
    }
  ];

  const INITIAL_COURSES = [
    { code: "CS101", title: "Data Structures & Algorithms", instructor: "Dr. Alok Kumar", credits: 4, dept: "Computer Science" },
    { code: "CS102", title: "Web Application Architecture", instructor: "Prof. S. Ranganathan", credits: 3, dept: "Computer Science" },
    { code: "IT201", title: "Database Systems & SQL", instructor: "Dr. Neha Kapoor", credits: 4, dept: "Information Tech" },
    { code: "EC301", title: "Digital Signal Processing", instructor: "Dr. K. V. Prasad", credits: 4, dept: "Electronics & Comm" },
    { code: "ME101", title: "Thermodynamics & Fluid Dynamics", instructor: "Prof. Rajesh Mehta", credits: 3, dept: "Mechanical Eng" },
    { code: "CE101", title: "Structural Engineering & CAD", instructor: "Dr. Sunita Reddy", credits: 4, dept: "Civil Engineering" }
  ];

  // 2. State Storage Helpers
  const STORAGE_KEY = "edupulse_students_db";

  const getStudents = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(data);
  };

  const saveStudents = (students) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  };

  // 3. Live System Clock
  const updateTime = () => {
    const timeEl = document.getElementById("live-time");
    if (timeEl) {
      const now = new Date();
      timeEl.querySelector("span").textContent = now.toLocaleTimeString();
    }
  };
  setInterval(updateTime, 1000);
  updateTime();

  // 4. Tab Navigation Switcher
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      const targetContent = document.getElementById(`tab-${tabId}`);
      if (targetContent) targetContent.classList.add("active");

      // Refresh view upon tab switch
      refreshAllViews();
    });
  });

  // 5. Toast Notification
  const showToast = (message) => {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
    }
  };

  // 6. Refresh All Views
  const refreshAllViews = () => {
    const students = getStudents();
    renderDashboard(students);
    renderStudentTable(students);
    renderAttendanceSheet(students);
    renderCoursesGrid(students);
    renderAnalytics(students);
  };

  // 7. Render Dashboard View
  const renderDashboard = (students) => {
    // Stat 1: Total
    document.getElementById("stat-total-students").textContent = students.length;

    // Stat 2: Avg Attendance
    const avgAtt = students.length
      ? (students.reduce((acc, s) => acc + parseFloat(s.attendance), 0) / students.length).toFixed(1)
      : "0.0";
    document.getElementById("stat-avg-attendance").textContent = `${avgAtt}%`;

    // Stat 3: Highest GPA
    const highestGpa = students.length
      ? Math.max(...students.map((s) => parseFloat(s.gpa))).toFixed(2)
      : "0.00";
    document.getElementById("stat-highest-gpa").textContent = highestGpa;

    // Department Breakdown Bars
    const deptCounts = {};
    students.forEach((s) => {
      deptCounts[s.dept] = (deptCounts[s.dept] || 0) + 1;
    });

    const deptBarsContainer = document.getElementById("department-bars");
    if (deptBarsContainer) {
      deptBarsContainer.innerHTML = Object.entries(deptCounts)
        .map(([dept, count]) => {
          const pct = ((count / students.length) * 100).toFixed(0);
          return `
            <div class="dept-bar-item">
              <div class="dept-info">
                <span>${dept}</span>
                <span>${count} students (${pct}%)</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" style="width: ${pct}%;"></div>
              </div>
            </div>
          `;
        })
        .join("");
    }

    // Top Performers Leaderboard
    const sortedTop = [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 4);
    const leaderboardContainer = document.getElementById("dashboard-leaderboard");
    if (leaderboardContainer) {
      leaderboardContainer.innerHTML = sortedTop
        .map(
          (s, idx) => `
          <div class="leader-item">
            <div class="leader-info">
              <span class="leader-rank">#${idx + 1}</span>
              <div>
                <strong>${s.name}</strong>
                <div class="small text-muted">${s.rollNo} &bull; ${s.dept}</div>
              </div>
            </div>
            <span class="leader-gpa">${parseFloat(s.gpa).toFixed(2)} GPA</span>
          </div>
        `
        )
        .join("");
    }

    // Recent Registrations Table
    const recentTbody = document.getElementById("recent-students-tbody");
    if (recentTbody) {
      recentTbody.innerHTML = students
        .slice(-5)
        .reverse()
        .map(
          (s) => `
          <tr>
            <td><code>${s.rollNo}</code></td>
            <td><strong>${s.name}</strong></td>
            <td>${s.dept}</td>
            <td>${s.sem}</td>
            <td><span class="gpa-pill">${parseFloat(s.gpa).toFixed(2)}</span></td>
            <td>${s.attendance}%</td>
            <td><span class="status-badge status-${s.status.toLowerCase().replace(" ", "")}">${s.status}</span></td>
          </tr>
        `
        )
        .join("");
    }
  };

  // 8. Render Student Directory & Filtering
  const renderStudentTable = (students) => {
    const searchVal = document.getElementById("search-input")?.value.toLowerCase().trim() || "";
    const deptVal = document.getElementById("filter-dept")?.value || "";
    const semVal = document.getElementById("filter-sem")?.value || "";
    const statusVal = document.getElementById("filter-status")?.value || "";

    const filtered = students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchVal) ||
        s.rollNo.toLowerCase().includes(searchVal) ||
        s.email.toLowerCase().includes(searchVal);
      const matchesDept = !deptVal || s.dept === deptVal;
      const matchesSem = !semVal || s.sem === semVal;
      const matchesStatus = !statusVal || s.status === statusVal;

      return matchesSearch && matchesDept && matchesSem && matchesStatus;
    });

    const countLabel = document.getElementById("table-count-label");
    if (countLabel) countLabel.textContent = `Showing ${filtered.length} of ${students.length} students`;

    const tbody = document.getElementById("students-tbody");
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted" style="padding: 2.5rem;">
            <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
            No student records match your filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered
      .map(
        (s) => `
        <tr>
          <td><code>${s.rollNo}</code></td>
          <td><strong>${s.name}</strong></td>
          <td>${s.dept}</td>
          <td>${s.sem}</td>
          <td><span class="text-muted">${s.email}</span></td>
          <td><span class="gpa-pill">${parseFloat(s.gpa).toFixed(2)}</span></td>
          <td>${s.attendance}%</td>
          <td><span class="status-badge status-${s.status.toLowerCase().replace(" ", "")}">${s.status}</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action btn-view" data-id="${s.id}" title="View Marksheet">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn-action btn-edit" data-id="${s.id}" title="Edit Student">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn-action delete btn-delete" data-id="${s.id}" title="Delete Student">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");

    // Attach Event Listeners to Action Buttons
    tbody.querySelectorAll(".btn-view").forEach((b) => {
      b.addEventListener("click", () => openProfileModal(b.getAttribute("data-id")));
    });

    tbody.querySelectorAll(".btn-edit").forEach((b) => {
      b.addEventListener("click", () => openEditStudentModal(b.getAttribute("data-id")));
    });

    tbody.querySelectorAll(".btn-delete").forEach((b) => {
      b.addEventListener("click", () => deleteStudent(b.getAttribute("data-id")));
    });
  };

  // Filter Input Listeners
  ["search-input", "filter-dept", "filter-sem", "filter-status"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", () => {
      renderStudentTable(getStudents());
    });
  });

  document.getElementById("reset-filters-btn")?.addEventListener("click", () => {
    if (document.getElementById("search-input")) document.getElementById("search-input").value = "";
    if (document.getElementById("filter-dept")) document.getElementById("filter-dept").value = "";
    if (document.getElementById("filter-sem")) document.getElementById("filter-sem").value = "";
    if (document.getElementById("filter-status")) document.getElementById("filter-status").value = "";
    renderStudentTable(getStudents());
  });

  // 9. Attendance Tracker Module
  const renderAttendanceSheet = (students) => {
    const deptVal = document.getElementById("att-dept")?.value || "Computer Science";
    const deptLabel = document.getElementById("att-dept-label");
    if (deptLabel) deptLabel.textContent = `${deptVal} Department`;

    const deptStudents = students.filter((s) => s.dept === deptVal);
    const tbody = document.getElementById("attendance-tbody");
    if (!tbody) return;

    if (deptStudents.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No students enrolled in this department.</td></tr>`;
      return;
    }

    tbody.innerHTML = deptStudents
      .map(
        (s) => `
        <tr data-student-id="${s.id}">
          <td><code>${s.rollNo}</code></td>
          <td><strong>${s.name}</strong></td>
          <td>${s.attendance}%</td>
          <td class="text-center">
            <div class="att-switch">
              <button class="att-opt present active" data-val="present">Present</button>
              <button class="att-opt absent" data-val="absent">Absent</button>
              <button class="att-opt late" data-val="late">Late</button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");

    // Toggle button active states
    tbody.querySelectorAll(".att-opt").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const parentSwitch = e.target.closest(".att-switch");
        parentSwitch.querySelectorAll(".att-opt").forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
      });
    });
  };

  document.getElementById("att-dept")?.addEventListener("change", () => {
    renderAttendanceSheet(getStudents());
  });

  document.getElementById("btn-mark-all-present")?.addEventListener("click", () => {
    document.querySelectorAll("#attendance-tbody .att-switch").forEach((sw) => {
      sw.querySelectorAll(".att-opt").forEach((b) => b.classList.remove("active"));
      sw.querySelector(".att-opt.present")?.classList.add("active");
    });
    showToast("Marked all students present!");
  });

  document.getElementById("btn-save-attendance")?.addEventListener("click", () => {
    const students = getStudents();
    document.querySelectorAll("#attendance-tbody tr").forEach((row) => {
      const id = row.getAttribute("data-student-id");
      const activeOpt = row.querySelector(".att-opt.active")?.getAttribute("data-val");
      const student = students.find((s) => s.id === id);

      if (student) {
        if (activeOpt === "present") student.attendance = Math.min(100, parseFloat(student.attendance) + 0.5).toFixed(1);
        else if (activeOpt === "absent") student.attendance = Math.max(0, parseFloat(student.attendance) - 1.0).toFixed(1);
      }
    });

    saveStudents(students);
    refreshAllViews();
    showToast("Attendance saved successfully!");
  });

  // Set Default Date
  const attDateInput = document.getElementById("att-date");
  if (attDateInput) attDateInput.value = new Date().toISOString().split("T")[0];

  // 10. Courses Grid
  const renderCoursesGrid = (students) => {
    const grid = document.getElementById("courses-grid");
    if (!grid) return;

    grid.innerHTML = INITIAL_COURSES.map((c) => {
      const enrolledCount = students.filter((s) => s.dept === c.dept).length;
      return `
        <div class="course-card">
          <span class="course-code">${c.code} &bull; ${c.credits} Credits</span>
          <h3 class="course-title">${c.title}</h3>
          <p class="course-instructor"><i class="fa-solid fa-chalkboard-user"></i> ${c.instructor}</p>
          <div class="course-footer">
            <span><i class="fa-solid fa-building-columns"></i> ${c.dept}</span>
            <span><strong>${enrolledCount}</strong> Students</span>
          </div>
        </div>
      `;
    }).join("");
  };

  // 11. Analytics & Dean's List
  const renderAnalytics = (students) => {
    const bandsContainer = document.getElementById("gpa-bands-container");
    if (bandsContainer) {
      const b1 = students.filter((s) => s.gpa >= 3.75).length;
      const b2 = students.filter((s) => s.gpa >= 3.5 && s.gpa < 3.75).length;
      const b3 = students.filter((s) => s.gpa >= 3.0 && s.gpa < 3.5).length;
      const b4 = students.filter((s) => s.gpa < 3.0).length;

      bandsContainer.innerHTML = `
        <div class="department-bars">
          <div class="dept-bar-item">
            <div class="dept-info"><span>Highest Honors (3.75 - 4.00)</span><span>${b1} students</span></div>
            <div class="bar-track"><div class="bar-fill" style="width: ${(b1/students.length)*100}%;"></div></div>
          </div>
          <div class="dept-bar-item">
            <div class="dept-info"><span>Honors Standing (3.50 - 3.74)</span><span>${b2} students</span></div>
            <div class="bar-track"><div class="bar-fill" style="width: ${(b2/students.length)*100}%;"></div></div>
          </div>
          <div class="dept-bar-item">
            <div class="dept-info"><span>Good Academic Standing (3.00 - 3.49)</span><span>${b3} students</span></div>
            <div class="bar-track"><div class="bar-fill" style="width: ${(b3/students.length)*100}%;"></div></div>
          </div>
          <div class="dept-bar-item">
            <div class="dept-info"><span>Academic Review (&lt; 3.00)</span><span>${b4} students</span></div>
            <div class="bar-track"><div class="bar-fill" style="width: ${(b4/students.length)*100}%; background: var(--danger);"></div></div>
          </div>
        </div>
      `;
    }

    const deansListContainer = document.getElementById("deans-list-container");
    if (deansListContainer) {
      const deansList = students.filter((s) => s.gpa >= 3.8).sort((a, b) => b.gpa - a.gpa);
      deansListContainer.innerHTML = deansList.map((s, idx) => `
        <div class="leader-item">
          <div class="leader-info">
            <span class="leader-rank"><i class="fa-solid fa-award"></i></span>
            <div>
              <strong>${s.name}</strong>
              <div class="small text-muted">${s.rollNo} &bull; ${s.dept}</div>
            </div>
          </div>
          <span class="leader-gpa">${parseFloat(s.gpa).toFixed(2)} GPA</span>
        </div>
      `).join("");
    }
  };

  // 12. Modal Add / Edit Student Handlers
  const studentModal = document.getElementById("student-modal");
  const studentForm = document.getElementById("student-form");

  const openAddStudentModal = () => {
    if (!studentModal || !studentForm) return;
    studentForm.reset();
    document.getElementById("student-id").value = "";
    document.getElementById("modal-title").textContent = "Add New Student";
    document.getElementById("modal-submit-btn").textContent = "Save Student";
    studentModal.classList.add("active");
  };

  const openEditStudentModal = (id) => {
    const students = getStudents();
    const student = students.find((s) => s.id === id);
    if (!student || !studentModal) return;

    document.getElementById("student-id").value = student.id;
    document.getElementById("input-roll").value = student.rollNo;
    document.getElementById("input-name").value = student.name;
    document.getElementById("input-dept").value = student.dept;
    document.getElementById("input-sem").value = student.sem;
    document.getElementById("input-email").value = student.email;
    document.getElementById("input-status").value = student.status;
    document.getElementById("input-gpa").value = student.gpa;
    document.getElementById("input-attendance").value = student.attendance;

    document.getElementById("modal-title").textContent = "Edit Student Details";
    document.getElementById("modal-submit-btn").textContent = "Update Student";
    studentModal.classList.add("active");
  };

  const closeModal = () => {
    if (studentModal) studentModal.classList.remove("active");
  };

  document.getElementById("btn-add-student")?.addEventListener("click", openAddStudentModal);
  document.getElementById("btn-add-student-alt")?.addEventListener("click", openAddStudentModal);
  document.getElementById("modal-close-btn")?.addEventListener("click", closeModal);
  document.getElementById("modal-cancel-btn")?.addEventListener("click", closeModal);

  if (studentForm) {
    studentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const id = document.getElementById("student-id").value;
      const students = getStudents();

      const newStudent = {
        id: id || `std-${Date.now()}`,
        rollNo: document.getElementById("input-roll").value.trim(),
        name: document.getElementById("input-name").value.trim(),
        dept: document.getElementById("input-dept").value,
        sem: document.getElementById("input-sem").value,
        email: document.getElementById("input-email").value.trim(),
        status: document.getElementById("input-status").value,
        gpa: parseFloat(document.getElementById("input-gpa").value),
        attendance: parseFloat(document.getElementById("input-attendance").value)
      };

      if (id) {
        const index = students.findIndex((s) => s.id === id);
        if (index !== -1) students[index] = newStudent;
        showToast("Student updated successfully!");
      } else {
        students.push(newStudent);
        showToast("Student added successfully!");
      }

      saveStudents(students);
      closeModal();
      refreshAllViews();
    });
  }

  // 13. Delete Student Handler
  const deleteStudent = (id) => {
    if (confirm("Are you sure you want to delete this student record?")) {
      let students = getStudents();
      students = students.filter((s) => s.id !== id);
      saveStudents(students);
      refreshAllViews();
      showToast("Student deleted successfully.");
    }
  };

  // 14. Reset Demo Data
  document.getElementById("btn-reset-data")?.addEventListener("click", () => {
    if (confirm("Reset student directory back to initial college demo data?")) {
      saveStudents(INITIAL_STUDENTS);
      refreshAllViews();
      showToast("Demo dataset restored!");
    }
  });

  // 15. Student Profile & Transcript Modal
  const profileModal = document.getElementById("profile-modal");

  const openProfileModal = (id) => {
    const students = getStudents();
    const s = students.find((item) => item.id === id);
    if (!s || !profileModal) return;

    const header = document.getElementById("transcript-header");
    const body = document.getElementById("transcript-body");

    if (header) {
      header.innerHTML = `
        <div class="transcript-avatar">${s.name.split(" ").map((n) => n[0]).join("")}</div>
        <div>
          <h2>${s.name}</h2>
          <p class="text-muted">${s.rollNo} &bull; ${s.dept}</p>
        </div>
      `;
    }

    if (body) {
      body.innerHTML = `
        <div class="transcript-meta">
          <div class="meta-box"><span>Semester</span><strong>${s.sem}</strong></div>
          <div class="meta-box"><span>Cumulative GPA</span><strong>${parseFloat(s.gpa).toFixed(2)}</strong></div>
          <div class="meta-box"><span>Attendance</span><strong>${s.attendance}%</strong></div>
          <div class="meta-box"><span>Academic Standing</span><strong>${s.status}</strong></div>
        </div>

        <h4 style="margin-bottom: 0.8rem;"><i class="fa-solid fa-list-check"></i> Enrolled Curriculum Performance</h4>
        <table class="data-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>CS101</code></td>
              <td>Data Structures &amp; Algorithms</td>
              <td>4</td>
              <td><span class="gpa-pill">A</span></td>
            </tr>
            <tr>
              <td><code>CS102</code></td>
              <td>Web Application Architecture</td>
              <td>3</td>
              <td><span class="gpa-pill">A+</span></td>
            </tr>
            <tr>
              <td><code>MA201</code></td>
              <td>Engineering Mathematics III</td>
              <td>4</td>
              <td><span class="gpa-pill">B+</span></td>
            </tr>
          </tbody>
        </table>
      `;
    }

    profileModal.classList.add("active");
  };

  document.getElementById("profile-close-btn")?.addEventListener("click", () => {
    if (profileModal) profileModal.classList.remove("active");
  });

  document.getElementById("profile-done-btn")?.addEventListener("click", () => {
    if (profileModal) profileModal.classList.remove("active");
  });

  document.getElementById("btn-print-transcript")?.addEventListener("click", () => {
    window.print();
  });

  // 16. CSV Export Function
  document.getElementById("export-csv-btn")?.addEventListener("click", () => {
    const students = getStudents();
    if (students.length === 0) {
      showToast("No data to export!");
      return;
    }

    const headers = ["Roll No", "Full Name", "Department", "Semester", "Email", "GPA", "Attendance %", "Status"];
    const rows = students.map((s) => [s.rollNo, `"${s.name}"`, `"${s.dept}"`, s.sem, s.email, s.gpa, s.attendance, s.status]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Student_Directory_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("CSV directory exported successfully!");
  });

  document.getElementById("view-all-students-btn")?.addEventListener("click", () => {
    document.querySelector('.tab-btn[data-tab="students"]')?.click();
  });

  // Initialize App View
  refreshAllViews();
});
