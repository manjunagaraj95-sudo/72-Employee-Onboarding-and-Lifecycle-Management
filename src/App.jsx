 */
import React, { useState, useEffect } from 'react';

// Centralized Role-Based Access Control (RBAC) Configuration
const ROLES = {
    ADMIN: 'Admin',
    HR_TEAM: 'HR Team',
    IT_TEAM: 'IT Team',
    HIRING_MANAGER: 'Hiring Manager',
    EMPLOYEE: 'Employee',
};

// Simulate current user role
const currentUserRole = ROLES.HR_TEAM; // Change this to test different roles

// Utility Functions & Constants
const STATUS_COLORS = {
    APPROVED: 'status-approved',
    IN_PROGRESS: 'status-in-progress',
    PENDING: 'status-pending',
    REJECTED: 'status-rejected',
    EXCEPTION: 'status-exception',
};

// --- Sample Data ---
const sampleEmployees = [
    {
        id: 'emp-001',
        name: 'Alice Johnson',
        title: 'Software Engineer',
        department: 'Engineering',
        status: 'In Progress', // Onboarding status
        onboardingStage: 'Document Submission',
        startDate: '2024-08-01',
        progress: 40,
        assignedTo: 'HR Team',
        email: 'alice.j@example.com',
        phone: '123-456-7890',
        manager: 'Bob Smith',
    },
    {
        id: 'emp-002',
        name: 'Bob Smith',
        title: 'HR Specialist',
        department: 'Human Resources',
        status: 'Approved',
        onboardingStage: 'Completed',
        startDate: '2024-07-15',
        progress: 100,
        assignedTo: 'N/A',
        email: 'bob.s@example.com',
        phone: '098-765-4321',
        manager: 'Carol White',
    },
    {
        id: 'emp-003',
        name: 'Charlie Brown',
        title: 'IT Support',
        department: 'Information Technology',
        status: 'Pending',
        onboardingStage: 'Hardware Setup',
        startDate: '2024-09-01',
        progress: 20,
        assignedTo: 'IT Team',
        email: 'charlie.b@example.com',
        phone: '111-222-3333',
        manager: 'David Green',
    },
    {
        id: 'emp-004',
        name: 'Diana Prince',
        title: 'Project Manager',
        department: 'Operations',
        status: 'Approved',
        onboardingStage: 'Completed',
        startDate: '2024-07-01',
        progress: 100,
        assignedTo: 'N/A',
        email: 'diana.p@example.com',
        phone: '444-555-6666',
        manager: 'Eve Adams',
    },
    {
        id: 'emp-005',
        name: 'Eve Adams',
        title: 'Marketing Coordinator',
        department: 'Marketing',
        status: 'Rejected',
        onboardingStage: 'Initial Review',
        startDate: '2024-08-15',
        progress: 10,
        assignedTo: 'HR Team',
        email: 'eve.a@example.com',
        phone: '777-888-9999',
        manager: 'Frank Black',
    },
];

const onboardingMilestones = [
    { name: 'Offer Accepted', date: '2024-07-25', status: 'completed' },
    { name: 'Document Submission', date: '2024-07-28', status: 'current' },
    { name: 'Background Check', date: null, status: 'pending' },
    { name: 'IT Setup', date: null, status: 'pending' },
    { name: 'First Day', date: null, status: 'pending' },
];

const employeeAuditLog = [
    { id: 'log-001', type: 'status_update', timestamp: '2024-07-29T10:30:00Z', user: 'Admin', details: 'Status changed to "In Progress" for Document Submission.' },
    { id: 'log-002', type: 'document_upload', timestamp: '2024-07-28T14:15:00Z', user: 'Alice Johnson', details: 'W-4 form uploaded.' },
    { id: 'log-003', type: 'task_assigned', timestamp: '2024-07-27T09:00:00Z', user: 'HR Team', details: 'Onboarding tasks assigned to IT for hardware setup.' },
    { id: 'log-004', type: 'note_added', timestamp: '2024-07-26T16:45:00Z', user: 'Hiring Manager', details: 'Checked in on progress. Employee is responsive.' },
];

// --- Components ---

const Icon = ({ name, style = {} }) => {
    // A simple icon placeholder. In a real app, this would be an SVG component or font icon.
    return (
        <span style={{ fontFamily: 'Material Symbols Outlined', ...style }}>
            {name}
        </span>
    );
};

const Breadcrumbs = ({ path, onNavigate }) => (
    <div className="breadcrumbs">
        <a href="#" onClick={() => onNavigate({ screen: 'DASHBOARD' })}>Dashboard</a>
        {path.map((item, index) => (
            <React.Fragment key={index}>
                <span>/</span>
                {item.onClick ? (
                    <a href="#" onClick={() => onNavigate(item.onClick)}>{item.label}</a>
                ) : (
                    <span>{item.label}</span>
                )}
            </React.Fragment>
        ))}
    </div>
);

const Header = ({ onSearch, onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // In a real app, this would trigger a debounced search function
        onSearch?.(event.target.value);
    };

    return (
        <header className="app-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <h1 style={{ fontSize: 'var(--font-size-xl)', margin: '0' }}>
                    <a href="#" onClick={() => onNavigate({ screen: 'DASHBOARD' })} style={{ textDecoration: 'none', color: 'var(--color-charcoal)' }}>
                        Employee Lifecycle
                    </a>
                </h1>
            </div>
            <div className="search-bar" style={{ flexGrow: '1', maxWidth: '400px', margin: '0 var(--spacing-xl)' }}>
                <input
                    type="text"
                    placeholder="Global search for employees, tasks, documents..."
                    className="form-control search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Icon name="search" style={{ position: 'absolute', right: 'var(--spacing-md)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-dark-gray)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                {currentUserRole === ROLES.HR_TEAM && (
                    <button className="btn btn-primary" onClick={() => alert('Add Employee clicked')}>
                        <Icon name="person_add" style={{ marginRight: 'var(--spacing-xs)' }} /> Add Employee
                    </button>
                )}
                <Icon name="notifications" style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-dark-gray)' }} />
                <Icon name="account_circle" style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-dark-gray)' }} />
            </div>
        </header>
    );
};

const CardComponent = ({ title, subtitle, status, onClick, children, badge = null, details = [] }) => {
    const statusClass = STATUS_COLORS[status?.replace(' ', '_').toUpperCase()] || '';
    return (
        <div className={`card ${statusClass}`} onClick={onClick} style={{ position: 'relative' }}>
            {badge && (
                <div style={{ position: 'absolute', top: 'var(--spacing-sm)', right: 'var(--spacing-sm)', padding: 'var(--spacing-xs) var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'var(--color-blue-100)', color: 'var(--color-blue-500)', fontSize: 'var(--font-size-xs)', fontWeight: 'bold' }}>
                    {badge}
                </div>
            )}
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{title}</h3>
            {subtitle && <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-md)' }}>{subtitle}</p>}
            {details.map((detail, index) => (
                <p key={index} style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)', display: 'flex', alignItems: 'center' }}>
                    <Icon name={detail.icon} style={{ fontSize: 'var(--font-size-sm)', marginRight: 'var(--spacing-xs)', color: 'var(--color-dark-gray)' }} />
                    {detail.label}: <span style={{ fontWeight: '500', marginLeft: 'var(--spacing-xs)' }}>{detail.value}</span>
                </p>
            ))}
            {children}
            {/* Quick Actions (Hover) - only visible on web for non-mobile specific */}
            <div style={{ position: 'absolute', top: 'var(--spacing-md)', right: 'var(--spacing-md)', opacity: 0, transition: 'opacity 0.2s ease-in-out', display: currentUserRole === ROLES.HR_TEAM ? 'flex' : 'none' }} className="card-hover-actions">
                <button className="btn btn-text" onClick={(e) => { e.stopPropagation(); alert('Edit clicked'); }}><Icon name="edit" /></button>
                <button className="btn btn-text" onClick={(e) => { e.stopPropagation(); alert('Approve clicked'); }}><Icon name="check_circle" /></button>
            </div>
            <style jsx>{`
                .card:hover .card-hover-actions {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

const MilestoneTracker = ({ milestones, currentStage }) => (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Onboarding Progress</h3>
        <div className="milestone-tracker">
            {milestones.map((milestone, index) => (
                <div key={index} className={`milestone ${milestone.status}`}>
                    <div className={`milestone-dot ${milestone.status === 'completed' ? 'completed' : ''} ${milestone.status === 'current' ? 'current' : ''}`}>
                        {milestone.status === 'completed' ? <Icon name="check" style={{ fontSize: 'var(--font-size-sm)' }} /> : index + 1}
                    </div>
                    <span className="milestone-label">{milestone.name}</span>
                </div>
            ))}
        </div>
    </div>
);

const NewsFeed = ({ items, role }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'status_update': return 'update';
            case 'document_upload': return 'upload_file';
            case 'task_assigned': return 'assignment';
            case 'note_added': return 'notes';
            default: return 'info';
        }
    };

    const isVisibleForRole = (logItem) => {
        // Simple RBAC for logs: e.g., only Admin/HR can see all details
        if (role === ROLES.ADMIN || role === ROLES.HR_TEAM) return true;
        if (logItem.type === 'document_upload' && logItem.user === currentUserRole) return true; // Employee can see their uploads
        return false;
    };

    const filteredItems = items.filter(isVisibleForRole);

    return (
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Recent Activity & Audit Log</h3>
            <div className="detail-section">
                {filteredItems.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--color-dark-gray)', padding: 'var(--spacing-md)' }}>No recent activity.</div>
                )}
                {filteredItems.map(item => (
                    <div key={item.id} className="news-feed-item">
                        <Icon name={getIcon(item.type)} style={{ color: 'var(--color-blue-500)' }} />
                        <div>
                            <p style={{ margin: 0 }}>
                                <span style={{ fontWeight: '500' }}>{item.user}</span> {item.details}
                            </p>
                            <small className="meta">{new Date(item.timestamp).toLocaleString()}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DashboardScreen = ({ onNavigate }) => {
    const pendingOnboardings = sampleEmployees.filter(emp => emp.status === 'Pending').length;
    const inProgressOnboardings = sampleEmployees.filter(emp => emp.status === 'In Progress').length;
    const completedOnboardings = sampleEmployees.filter(emp => emp.status === 'Approved').length;

    const summaryCards = [
        {
            title: 'Total Employees',
            value: sampleEmployees.length,
            icon: 'group',
            linkScreen: 'EMPLOYEE_LIST',
            linkParams: {}
        },
        {
            title: 'Pending Onboardings',
            value: pendingOnboardings,
            icon: 'pending_actions',
            linkScreen: 'EMPLOYEE_LIST',
            linkParams: { status: 'Pending' }
        },
        {
            title: 'In Progress Onboardings',
            value: inProgressOnboardings,
            icon: 'play_for_work',
            linkScreen: 'EMPLOYEE_LIST',
            linkParams: { status: 'In Progress' }
        },
        {
            title: 'Completed Onboardings',
            value: completedOnboardings,
            icon: 'check_circle',
            linkScreen: 'EMPLOYEE_LIST',
            linkParams: { status: 'Approved' }
        },
    ];

    const handleChartClick = (chartType) => {
        alert(`Navigating to detailed ${chartType} report.`);
        // In a real app, this would navigate to a dedicated report screen
    };

    return (
        <div className="container">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                Dashboard <span className="live-indicator"></span> Real-time
            </h2>
            <div className="dashboard-grid">
                {summaryCards.map((card, index) => (
                    <CardComponent
                        key={index}
                        title={card.title}
                        onClick={() => onNavigate({ screen: card.linkScreen, params: card.linkParams })}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-md)' }}>
                            <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-blue-500)' }}>{card.value}</span>
                            <Icon name={card.icon} style={{ fontSize: 'var(--font-size-4xl)', opacity: 0.2, color: 'var(--color-blue-500)' }} />
                        </div>
                        <small style={{ marginTop: 'var(--spacing-md)', display: 'block' }}>View details <Icon name="arrow_right_alt" style={{ verticalAlign: 'middle' }} /></small>
                    </CardComponent>
                ))}
            </div>

            <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    Key Performance Indicators <span className="live-indicator"></span>
                </h2>
                <div className="dashboard-grid">
                    <CardComponent title="Onboarding Time (Avg.)" onClick={() => handleChartClick('Bar Chart')}>
                        <div className="chart-placeholder">Bar Chart Placeholder</div>
                        <small style={{ marginTop: 'var(--spacing-md)', display: 'block' }}>Average days per onboarding</small>
                    </CardComponent>
                    <CardComponent title="Completion Rate" onClick={() => handleChartClick('Donut Chart')}>
                        <div className="chart-placeholder">Donut Chart Placeholder</div>
                        <small style={{ marginTop: 'var(--spacing-md)', display: 'block' }}>Percentage of successful onboardings</small>
                    </CardComponent>
                    <CardComponent title="SLA Compliance" onClick={() => handleChartClick('Gauge Chart')}>
                        <div className="chart-placeholder">Gauge Chart Placeholder</div>
                        <small style={{ marginTop: 'var(--spacing-md)', display: 'block' }}>Onboarding tasks meeting SLA</small>
                    </CardComponent>
                    <CardComponent title="Departmental Progress" onClick={() => handleChartClick('Line Chart')}>
                        <div className="chart-placeholder">Line Chart Placeholder</div>
                        <small style={{ marginTop: 'var(--spacing-md)', display: 'block' }}>Onboarding trend over time</small>
                    </CardComponent>
                </div>
            </div>

            {currentUserRole === ROLES.HR_TEAM && (
                <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        HR Team Tasks <span className="live-indicator"></span>
                    </h2>
                    <div className="card-grid">
                        <CardComponent
                            title="Review Pending Documents"
                            subtitle="3 pending submissions"
                            status="Pending"
                            onClick={() => alert('Review Documents Clicked')}
                            details={[
                                { icon: 'person', label: 'Assigned To', value: 'HR Team' },
                            ]}
                        />
                        <CardComponent
                            title="IT Setup Requests"
                            subtitle="5 new IT provisioning tasks"
                            status="In Progress"
                            onClick={() => alert('IT Setup Clicked')}
                            details={[
                                { icon: 'person', label: 'Assigned To', value: 'IT Team' },
                            ]}
                            badge="High Priority"
                        />
                        <CardComponent
                            title="Approve New Hire"
                            subtitle="John Doe, Marketing"
                            status="Pending"
                            onClick={() => alert('Approve Hire Clicked')}
                            details={[
                                { icon: 'calendar_month', label: 'Due By', value: '2024-08-05' },
                            ]}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const EmployeeListScreen = ({ onNavigate, params }) => {
    const [filterStatus, setFilterStatus] = useState(params?.status || '');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEmployees = sampleEmployees.filter(employee => {
        const matchesStatus = filterStatus ? employee.status === filterStatus : true;
        const matchesSearch = searchTerm ?
            employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.department?.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        return matchesStatus && matchesSearch;
    });

    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const breadcrumbPath = [
        { label: 'Employees', onClick: { screen: 'EMPLOYEE_LIST' } },
    ];
    if (filterStatus) {
        breadcrumbPath.push({ label: `${filterStatus} Onboardings` });
    }

    return (
        <div className="container">
            <Breadcrumbs path={breadcrumbPath} onNavigate={onNavigate} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                <h2>Employee Onboardings {filterStatus ? `(${filterStatus})` : ''}</h2>
                {currentUserRole === ROLES.HR_TEAM && (
                    <button className="btn btn-primary" onClick={() => alert('Add Employee clicked')}>
                        <Icon name="person_add" style={{ marginRight: 'var(--spacing-xs)' }} /> Add New
                    </button>
                )}
            </div>

            <div className="filters-panel" style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                <div className="form-group" style={{ flexGrow: '1', margin: '0' }}>
                    <label htmlFor="searchEmployees" style={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}>Search Employees</label>
                    <input
                        id="searchEmployees"
                        type="text"
                        className="form-control"
                        placeholder="Search by name, title, department..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ paddingRight: 'var(--spacing-xl)' }}
                    />
                    <Icon name="search" style={{ position: 'relative', left: '-30px', color: 'var(--color-dark-gray)' }} />
                </div>
                <div className="form-group" style={{ margin: '0' }}>
                    <label htmlFor="statusFilter" style={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}>Filter by Status</label>
                    <select
                        id="statusFilter"
                        className="form-control"
                        value={filterStatus}
                        onChange={handleFilterChange}
                        style={{ width: 'auto' }}
                    >
                        <option value="">All Statuses</option>
                        <option value="Approved">Approved</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Exception">Exception</option>
                    </select>
                </div>
                <button className="btn btn-secondary" onClick={() => { setFilterStatus(''); setSearchTerm(''); alert('Filters Reset'); }}>
                    <Icon name="filter_alt_off" style={{ marginRight: 'var(--spacing-xs)' }} /> Reset Filters
                </button>
                <button className="btn btn-secondary" onClick={() => alert('Saved Views clicked')}>
                    <Icon name="bookmark" style={{ marginRight: 'var(--spacing-xs)' }} /> Saved Views
                </button>
                <button className="btn btn-secondary" onClick={() => alert('Export to Excel/PDF')}>
                    <Icon name="download" style={{ marginRight: 'var(--spacing-xs)' }} /> Export
                </button>
            </div>


            <div className="card-grid">
                {filteredEmployees.length > 0 ? (
                    filteredEmployees.map(employee => (
                        <CardComponent
                            key={employee.id}
                            title={employee.name}
                            subtitle={employee.title}
                            status={employee.status}
                            onClick={() => onNavigate({ screen: 'EMPLOYEE_DETAIL', params: { id: employee.id } })}
                            details={[
                                { icon: 'apartment', label: 'Dept', value: employee.department },
                                { icon: 'flag', label: 'Stage', value: employee.onboardingStage },
                                { icon: 'event', label: 'Start Date', value: employee.startDate },
                            ]}
                            badge={`${employee.progress}% Progress`}
                        />
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <div className="empty-state">
                            <img src="https://assets-global.website-files.com/6245353841602c3008779940/6245367b66723b7e735e0544_no-data-illustration.svg" alt="No data" />
                            <h3>No Employees Found</h3>
                            <p>It looks like there are no employees matching your current filters.</p>
                            <button className="btn btn-primary" onClick={() => { setFilterStatus(''); setSearchTerm(''); }}>Clear Filters</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const EmployeeDetailScreen = ({ onNavigate, params }) => {
    const employee = sampleEmployees.find(emp => emp.id === params.id);

    if (!employee) {
        return (
            <div className="container">
                <Breadcrumbs path={[{ label: 'Employees', onClick: { screen: 'EMPLOYEE_LIST' } }, { label: 'Not Found' }]} onNavigate={onNavigate} />
                <h2 style={{ color: 'var(--color-red-500)' }}>Employee Not Found</h2>
                <p>The employee with ID "{params.id}" could not be found.</p>
                <button className="btn btn-primary" onClick={() => onNavigate({ screen: 'EMPLOYEE_LIST' })}>
                    Back to Employee List
                </button>
            </div>
        );
    }

    const breadcrumbPath = [
        { label: 'Employees', onClick: { screen: 'EMPLOYEE_LIST' } },
        { label: employee.name },
    ];

    const getSLAStatus = (stage) => {
        // Simple SLA logic for demo: "Document Submission" is critical
        if (employee.onboardingStage === stage.name && new Date() > new Date(employee.startDate).setDate(new Date(employee.startDate).getDate() + 7) && stage.status !== 'completed') {
            return { overdue: true, text: 'SLA Breached!' };
        }
        return { overdue: false, text: '' };
    };

    return (
        <div className="container">
            <Breadcrumbs path={breadcrumbPath} onNavigate={onNavigate} />
            <div className="detail-header">
                <h2>{employee.name} - {employee.title}</h2>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    {(currentUserRole === ROLES.HR_TEAM || currentUserRole === ROLES.ADMIN) && (
                        <>
                            <button className="btn btn-secondary" onClick={() => alert(`Editing ${employee.name}`)}>
                                <Icon name="edit" style={{ marginRight: 'var(--spacing-xs)' }} /> Edit Employee
                            </button>
                            <button className="btn btn-primary" onClick={() => alert(`Triggering workflow for ${employee.name}`)}>
                                <Icon name="play_circle" style={{ marginRight: 'var(--spacing-xs)' }} /> Advance Workflow
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="detail-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Onboarding Status: <span className={STATUS_COLORS[employee.status?.replace(' ', '_').toUpperCase()]} style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)', fontWeight: '500' }}>{employee.status}</span></h3>
                    {getSLAStatus(onboardingMilestones.find(m => m.status === 'current') || {}).overdue && (
                        <span style={{ color: 'var(--color-red-500)', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                            <Icon name="warning" style={{ marginRight: 'var(--spacing-xs)' }} /> SLA Breached!
                        </span>
                    )}
                </div>
                <MilestoneTracker milestones={onboardingMilestones} currentStage={employee.onboardingStage} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)', marginTop: 'var(--spacing-lg)' }}>
                <div>
                    <div className="detail-section">
                        <h3>Employee Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <p><small>Department:</small><br /><strong>{employee.department}</strong></p>
                            <p><small>Start Date:</small><br /><strong>{employee.startDate}</strong></p>
                            <p><small>Manager:</small><br /><strong>{employee.manager}</strong></p>
                            <p><small>Email:</small><br /><strong>{employee.email}</strong></p>
                            <p><small>Phone:</small><br /><strong>{employee.phone}</strong></p>
                            <p><small>Assigned To:</small><br /><strong>{employee.assignedTo}</strong></p>
                        </div>
                        <h4 style={{ marginTop: 'var(--spacing-xl)' }}>Documents & Files</h4>
                        {/* Placeholder for document list / preview */}
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--color-light-gray)' }}>
                                <Icon name="description" style={{ marginRight: 'var(--spacing-sm)', color: 'var(--color-blue-500)' }} />
                                W-4 Form.pdf <button className="btn btn-text" onClick={() => alert('Preview W-4')}>Preview</button>
                            </li>
                            <li style={{ padding: 'var(--spacing-sm) 0' }}>
                                <Icon name="description" style={{ marginRight: 'var(--spacing-sm)', color: 'var(--color-blue-500)' }} />
                                Offer Letter.pdf <button className="btn btn-text" onClick={() => alert('Preview Offer Letter')}>Preview</button>
                            </li>
                            {(currentUserRole === ROLES.HR_TEAM || currentUserRole === ROLES.EMPLOYEE) && (
                                <li style={{ marginTop: 'var(--spacing-md)' }}>
                                    <button className="btn btn-secondary" onClick={() => alert('Upload Document')}>
                                        <Icon name="upload_file" style={{ marginRight: 'var(--spacing-xs)' }} /> Upload New Document
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div>
                    <NewsFeed items={employeeAuditLog} role={currentUserRole} />
                </div>
            </div>

        </div>
    );
};

// Main App Component
function App() {
    const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });

    const handleNavigate = (newView) => {
        // Ensure immutability for state updates
        setView(prevView => ({ ...prevView, ...newView }));
    };

    // Global Search Handler (for Header)
    const handleGlobalSearch = (term) => {
        console.log('Global search for:', term);
        // In a real application, this would navigate to a global search results screen
        // or update a global search state to filter current view if applicable.
        if (term) {
            alert(`Performing global search for: ${term}`);
            // Example: setView({ screen: 'SEARCH_RESULTS', params: { query: term } });
        }
    };

    const renderScreen = () => {
        switch (view.screen) {
            case 'DASHBOARD':
                return <DashboardScreen onNavigate={handleNavigate} />;
            case 'EMPLOYEE_LIST':
                return <EmployeeListScreen onNavigate={handleNavigate} params={view.params} />;
            case 'EMPLOYEE_DETAIL':
                return <EmployeeDetailScreen onNavigate={handleNavigate} params={view.params} />;
            default:
                return (
                    <div className="container" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <h2>404 - Screen Not Found</h2>
                        <p>The requested screen does not exist.</p>
                        <button className="btn btn-primary" onClick={() => handleNavigate({ screen: 'DASHBOARD' })}>
                            Go to Dashboard
                        </button>
                    </div>
                );
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header onSearch={handleGlobalSearch} onNavigate={handleNavigate} />
            <main className="app-main">
                {renderScreen()}
            </main>
        </div>
    );
}

export default App;
```