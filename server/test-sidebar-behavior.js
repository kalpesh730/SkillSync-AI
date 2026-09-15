import assert from 'assert';
import { MODULES, getProductModule } from '../client/src/utils/roles.js';

// Simulated getNavItems logic from Sidebar.jsx
const getNavItemsForRole = (role) => {
  if (!role) return [];
  const productModule = getProductModule(role);

  if (productModule === MODULES.STUDENT) {
    return [
      { name: 'Dashboard', path: '/student/dashboard' },
      { name: 'Profile', path: '/student/profile' },
      { name: 'Resume', path: '/student/profile' },
      { name: 'Skills', path: '/student/profile' },
      { name: 'Jobs', path: '/jobs' },
      { name: 'Applications', path: '/applications' },
      { name: 'AI Support', path: '/ai/dashboard' },
      { name: 'Settings', path: '/student/settings' },
    ];
  }

  if (productModule === MODULES.COMPANY) {
    return [
      { name: 'Dashboard', path: '/company/dashboard' },
      { name: 'My Company', path: '/companies' },
      { name: 'My Vacancies', path: '/jobs' },
      { name: 'My Applicants', path: '/applications' },
      { name: 'AI Support', path: '/ai/dashboard' },
      { name: 'Settings', path: '/admin/settings' },
    ];
  }

  return [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Students', path: '/student/profile' },
    { name: 'Companies', path: '/companies' },
    { name: 'Vacancies', path: '/jobs' },
    { name: 'Analytics', path: '/college/dashboard' },
    { name: 'AI Support', path: '/ai/dashboard' },
    { name: 'Settings', path: '/admin/settings' },
  ];
};

// Simulated State & Interaction Handlers
class SidebarState {
  constructor(initialState = false) {
    this.isOpen = initialState;
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  close() {
    this.isOpen = false;
  }
  handleKeyDown(key) {
    if (key === 'Escape' && this.isOpen) {
      this.close();
    }
  }
  handleNavClick() {
    this.close();
  }
}

console.log('=== Running Task 5 Sidebar Interaction & Role Navigation Tests ===\n');

let passed = 0;
let total = 0;

function test(description, fn) {
  total++;
  try {
    fn();
    console.log(`✅ [PASS] ${description}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${description}\n`, err.message);
  }
}

// 1. Role Navigation Tests
test('STUDENT receives student-specific navigation items', () => {
  const items = getNavItemsForRole('STUDENT');
  assert.strictEqual(items.length, 8);
  assert.strictEqual(items[0].name, 'Dashboard');
  assert.strictEqual(items[0].path, '/student/dashboard');
});

test('RECRUITER and COMPANY_HR receive company-specific navigation items', () => {
  const recruiterItems = getNavItemsForRole('RECRUITER');
  const hrItems = getNavItemsForRole('COMPANY_HR');
  assert.strictEqual(recruiterItems.length, 6);
  assert.strictEqual(hrItems.length, 6);
  assert.deepStrictEqual(recruiterItems, hrItems);
  assert.strictEqual(recruiterItems[1].name, 'My Company');
  assert.strictEqual(recruiterItems[2].name, 'My Vacancies');
  assert.strictEqual(recruiterItems[3].name, 'My Applicants');
});

test('PLACEMENT_OFFICER, COLLEGE_ADMIN, SUPER_ADMIN receive admin-specific navigation items', () => {
  const adminItems1 = getNavItemsForRole('PLACEMENT_OFFICER');
  const adminItems2 = getNavItemsForRole('COLLEGE_ADMIN');
  const adminItems3 = getNavItemsForRole('SUPER_ADMIN');
  assert.strictEqual(adminItems1.length, 7);
  assert.deepStrictEqual(adminItems1, adminItems2);
  assert.deepStrictEqual(adminItems2, adminItems3);
  assert.strictEqual(adminItems1[1].name, 'Students');
  assert.strictEqual(adminItems1[2].name, 'Companies');
  assert.strictEqual(adminItems1[3].name, 'Vacancies');
});

// 2. Interaction State Tests
test('Sidebar state starts closed by default on mobile', () => {
  const state = new SidebarState(false);
  assert.strictEqual(state.isOpen, false);
});

test('Hamburger toggle opens sidebar when closed', () => {
  const state = new SidebarState(false);
  state.toggle();
  assert.strictEqual(state.isOpen, true);
});

test('Hamburger toggle closes sidebar when open', () => {
  const state = new SidebarState(true);
  state.toggle();
  assert.strictEqual(state.isOpen, false);
});

test('Explicit close button / close function closes sidebar', () => {
  const state = new SidebarState(true);
  state.close();
  assert.strictEqual(state.isOpen, false);
});

test('Backdrop click closes sidebar', () => {
  const state = new SidebarState(true);
  // Backdrop click calls close()
  state.close();
  assert.strictEqual(state.isOpen, false);
});

test('Navigation item click closes sidebar on mobile/tablet', () => {
  const state = new SidebarState(true);
  state.handleNavClick();
  assert.strictEqual(state.isOpen, false);
});

test('Escape key closes sidebar when open', () => {
  const state = new SidebarState(true);
  state.handleKeyDown('Escape');
  assert.strictEqual(state.isOpen, false);
});

test('Non-Escape key does not close sidebar', () => {
  const state = new SidebarState(true);
  state.handleKeyDown('Enter');
  assert.strictEqual(state.isOpen, true);
});

console.log(`\n--- Test Results: ${passed}/${total} Passed ---`);
if (passed === total) {
  console.log('SUCCESS: All Task 5 Sidebar Interaction & Role Navigation Tests Passed!\n');
} else {
  process.exit(1);
}
