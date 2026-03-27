export interface OpenProjectConfig {
    baseUrl: string;
    apiKey: string;
}
export interface WorkPackage {
    id: number;
    subject: string;
    description?: any;
    status: {
        href: string;
        title: string;
    };
    type: {
        href: string;
        title: string;
    };
    priority?: {
        href: string;
        title: string;
    };
    assignee?: {
        href: string;
        title: string;
        name: string;
    };
    author?: {
        href: string;
        title: string;
        name: string;
    };
    project: {
        href: string;
        identifier: string;
        name: string;
    };
    startDate?: string;
    dueDate?: string;
    estimatedTime?: string;
    spentTime?: string;
    percentageDone?: number;
    lockVersion: number;
    _links?: {
        self: {
            href: string;
        };
        update?: {
            href: string;
        };
        updateImmediately?: {
            href: string;
        };
        delete?: {
            href: string;
        };
        schema?: {
            href: string;
        };
    };
}
export interface Project {
    id: number;
    identifier: string;
    name: string;
    description?: any;
    active: boolean;
    public: boolean;
    createdAt: string;
    updatedAt: string;
    status?: {
        href: string;
        title: string;
    };
    parent?: {
        href: string;
        title: string;
    };
    _links?: {
        self: {
            href: string;
        };
        workPackages?: {
            href: string;
        };
        createWorkPackageImmediately?: {
            href: string;
        };
    };
}
export interface Status {
    id: number;
    name: string;
    isDefault: boolean;
    isClosed: boolean;
    color: string;
    position: number;
}
export interface Type {
    id: number;
    name: string;
    color: string;
    position: number;
    isDefault: boolean;
    isMilestone: boolean;
}
export interface Priority {
    id: number;
    name: string;
    position: number;
    isDefault: boolean;
}
export interface User {
    id: number;
    name: string;
    login: string;
    email: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
}
export interface Version {
    id: number;
    name: string;
    description?: string;
    status: string;
    sharing: string;
    createdAt: string;
    updatedAt: string;
    startDate?: string;
    dueDate?: string;
}
export interface Membership {
    id: number;
    _links: {
        user: {
            href: string;
            title: string;
        };
        project: {
            href: string;
            title: string;
        };
        role: {
            href: string;
            title: string;
        }[];
    };
}
export interface Activity {
    id: number;
    type: string;
    createdAt: string;
    user: {
        href: string;
        title: string;
    };
    description: string;
    details: {
        format: string;
        raw: string;
        html: string;
    }[];
    htmlMessage?: string;
}
export interface Relation {
    id: number;
    type: string;
    _links: {
        self: {
            href: string;
        };
        workPackageFrom: {
            href: string;
            title: string;
        };
        workPackageTo: {
            href: string;
            title: string;
        };
    };
}
export declare class OpenProjectClient {
    private client;
    constructor(config: OpenProjectConfig);
    listProjects(params?: {
        page?: number;
        perPage?: number;
        filters?: string;
        sortBy?: string;
    }): Promise<{
        _embedded: {
            elements: Project[];
        };
        total: number;
    }>;
    getProject(projectId: number | string): Promise<Project>;
    createProject(data: {
        name: string;
        identifier: string;
        description?: string;
        parentId?: number;
        active?: boolean;
        public?: boolean;
    }): Promise<Project>;
    updateProject(projectId: number | string, data: Partial<{
        name: string;
        description: string;
        active: boolean;
        public: boolean;
        parentId: number;
        status: string;
    }>): Promise<Project>;
    deleteProject(projectId: number | string): Promise<void>;
    listProjectMembers(projectId: number | string): Promise<{
        _embedded: {
            elements: Membership[];
        };
    }>;
    addProjectMember(projectId: number | string, userId: number, roleIds: number[]): Promise<Membership>;
    removeProjectMember(projectId: number | string, membershipId: number): Promise<void>;
    listProjectVersions(projectId: number | string): Promise<{
        _embedded: {
            elements: Version[];
        };
    }>;
    createVersion(projectId: number | string, data: {
        name: string;
        description?: string;
        status?: string;
        startDate?: string;
        dueDate?: string;
    }): Promise<Version>;
    listWorkPackages(params?: {
        projectId?: number | string;
        filters?: string;
        page?: number;
        perPage?: number;
        sortBy?: string;
        select?: string;
    }): Promise<{
        _embedded: {
            elements: WorkPackage[];
        };
        total: number;
    }>;
    getWorkPackage(workPackageId: number): Promise<WorkPackage>;
    createWorkPackage(data: {
        subject: string;
        description?: string;
        projectId: number | string;
        typeId?: number;
        statusId?: number;
        priorityId?: number;
        assigneeId?: number;
        startDate?: string;
        dueDate?: string;
        estimatedTime?: string;
        parentId?: number;
        versionId?: number;
    }): Promise<WorkPackage>;
    updateWorkPackage(workPackageId: number, data: Partial<{
        subject: string;
        description: string;
        statusId: number;
        typeId: number;
        priorityId: number;
        assigneeId: number;
        startDate: string;
        dueDate: string;
        estimatedTime: string;
        percentageDone: number;
        parentId: number;
        versionId: number;
        lockVersion: number;
    }>): Promise<WorkPackage>;
    deleteWorkPackage(workPackageId: number): Promise<void>;
    listWorkPackageActivities(workPackageId: number): Promise<{
        _embedded: {
            elements: Activity[];
        };
    }>;
    addWorkPackageComment(workPackageId: number, comment: string): Promise<Activity>;
    listWorkPackageRelations(workPackageId: number): Promise<{
        _embedded: {
            elements: Relation[];
        };
    }>;
    createWorkPackageRelation(workPackageId: number, data: {
        type: string;
        workPackageIdTo: number;
    }): Promise<Relation>;
    deleteWorkPackageRelation(workPackageId: number, relationId: number): Promise<void>;
    getProjectWorkPackages(projectId: number | string): Promise<{
        _embedded: {
            elements: WorkPackage[];
        };
    }>;
    listStatuses(): Promise<{
        _embedded: {
            elements: Status[];
        };
    }>;
    listTypes(): Promise<{
        _embedded: {
            elements: Type[];
        };
    }>;
    getProjectTypes(projectId: number | string): Promise<{
        _embedded: {
            elements: Type[];
        };
    }>;
    listPriorities(): Promise<{
        _embedded: {
            elements: Priority[];
        };
    }>;
    listUsers(params?: {
        page?: number;
        perPage?: number;
        filters?: string;
    }): Promise<{
        _embedded: {
            elements: User[];
        };
    }>;
    getUser(userId: number): Promise<User>;
    getCurrentUser(): Promise<User>;
    listProjectAvailableAssignees(projectId: number | string): Promise<{
        _embedded: {
            elements: User[];
        };
    }>;
    listRoles(): Promise<{
        _embedded: {
            elements: {
                id: number;
                name: string;
            }[];
        };
    }>;
    listGroups(): Promise<{
        _embedded: {
            elements: {
                id: number;
                name: string;
            }[];
        };
    }>;
    listQueries(params?: {
        projectId?: number | string;
    }): Promise<{
        _embedded: {
            elements: any[];
        };
    }>;
    getApiRoot(): Promise<any>;
    search(query: string, params?: {
        projectId?: number | string;
        typeId?: number;
        statusId?: number;
    }): Promise<{
        _embedded: {
            elements: WorkPackage[];
        };
    }>;
}
