import * as actions from "../../src/actions/productGroups";
import * as api from "../../src/functions/api";

jest.mock( "whatwg-fetch" );

jest.mock( "../../src/functions/api", () => {
	return {
		getApiUrl: jest.fn( () => { return "" } ),
		prepareInternalRequest: jest.fn( ( endpoint, payload = {}, method = "GET" ) => {
			return { endpoint, method, payload };
		} ),
		doRequest: jest.fn( ( request ) => {
			if ( request.method === "GET" ) {
				return Promise.resolve(	[ { name: "ProductGroup" } ] );
			}

			return Promise.resolve( { status: 200 } );
		} )
	};
} );

jest.mock( "../../src/functions/auth", () => {
	return {
		getUserId: jest.fn( () => { return 2 } ),
		getAccessToken: jest.fn( () => { return "access" } ),
	}
} );

test( 'get all product groups action creator with success', () => {
	const dispatch = jest.fn();
	const getAllProductGroupsFunc = actions.getAllProductGroups();

	expect( getAllProductGroupsFunc ).toBeInstanceOf( Function );

	let request = api.prepareInternalRequest( `productGroups/` );

	return getAllProductGroupsFunc( dispatch ).then( () => {
		expect( api.prepareInternalRequest ).toHaveBeenCalled();
		expect( api.doRequest ).toHaveBeenCalledWith( request );
		expect( dispatch ).toHaveBeenCalledWith( actions.getAllProductGroupsSuccess( [ { name: "ProductGroup" } ] ) );
	} );
} );


test( 'get all product groups action creator with failure', () => {
	const dispatch = jest.fn();
	const getAllProductGroupsFunc = actions.getAllProductGroups();

	// Force a rejection to ensure the retrieveSitesFailure will be called.
	api.doRequest.mockImplementation( () => {
		return Promise.reject( Error( "Authorization required" ) );
	} );

	expect( getAllProductGroupsFunc ).toBeInstanceOf( Function );

	let request = api.prepareInternalRequest( `productGroups/` );

	return getAllProductGroupsFunc( dispatch ).then( () => {
		expect( api.prepareInternalRequest ).toHaveBeenCalled();
		expect( api.doRequest ).toHaveBeenCalledWith( request );
		expect( dispatch ).toHaveBeenCalledWith( actions.getAllProductGroupsFailure( "Authorization required" ) );
	} );
} );
