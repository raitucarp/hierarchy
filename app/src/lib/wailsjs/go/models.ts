export namespace application {
	
	export enum Event {
	    ReloadAllOpenedFiles = "ReloadAllOpenedFiles",
	    ReloadSelectedItems = "ReloadSelectedItems",
	    ChangeViewMode = "ChangeViewMode",
	    WindowMaximize = "WindowMaximize",
	}
	export enum QueryKey {
	    OpenedFilesKey = "OpenedFilesKey",
	    ViewModeKey = "ViewModeKey",
	    ListSelectedItemsKey = "ListSelectedItemsKey",
	}
	export enum ViewMode {
	    VListViewMode = "VListViewMode",
	    HListViewMode = "HListViewMode",
	    TreeViewMode = "TreeViewMode",
	    ChartViewMode = "ChartViewMode",
	    CardViewMode = "CardViewMode",
	}
	export class Metadata {
	    name: string;
	    layout: string;
	    file_path: string;
	
	    static createFrom(source: any = {}) {
	        return new Metadata(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.layout = source["layout"];
	        this.file_path = source["file_path"];
	    }
	}
	export class ListFile {
	    lists: listmd.Node[][];
	    metadata: Metadata;
	    viewMode: ViewMode;
	    selectedListItems: string[];
	    preSelectedListItems: string[];
	
	    static createFrom(source: any = {}) {
	        return new ListFile(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.lists = this.convertValues(source["lists"], listmd.Node);
	        this.metadata = this.convertValues(source["metadata"], Metadata);
	        this.viewMode = source["viewMode"];
	        this.selectedListItems = source["selectedListItems"];
	        this.preSelectedListItems = source["preSelectedListItems"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class OpenedFiles {
	    selected: string;
	    files: ListFile[];
	
	    static createFrom(source: any = {}) {
	        return new OpenedFiles(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.selected = source["selected"];
	        this.files = this.convertValues(source["files"], ListFile);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace listmd {
	
	export class Node {
	    id: number;
	    markdown: string;
	    children?: Node[];
	    uid: string;
	
	    static createFrom(source: any = {}) {
	        return new Node(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.markdown = source["markdown"];
	        this.children = this.convertValues(source["children"], Node);
	        this.uid = source["uid"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

