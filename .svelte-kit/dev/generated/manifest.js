const c = [
	() => import("..\\..\\..\\src\\routes\\__layout.svelte"),
	() => import("..\\components\\error.svelte"),
	() => import("..\\..\\..\\src\\routes\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\categoryTypes\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\categories\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\expenses\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\roadbook\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\suivi\\__layout.reset.svelte"),
	() => import("..\\..\\..\\src\\routes\\suivi\\index.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/categoryTypes/index.svelte
	[/^\/categoryTypes\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/categories/index.svelte
	[/^\/categories\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/expenses/index.svelte
	[/^\/expenses\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/roadbook/index.svelte
	[/^\/roadbook\/?$/, [c[0], c[6]], [c[1]]],

	// src/routes/suivi/index.svelte
	[/^\/suivi\/?$/, [c[7], c[8]], []],

	,

	,

	,

	,

	,

	
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];