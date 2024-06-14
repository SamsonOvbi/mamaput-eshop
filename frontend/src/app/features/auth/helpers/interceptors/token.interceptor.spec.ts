import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenInterceptor } from './token.interceptor';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

describe('TokenInterceptor', () => {
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: TokenInterceptor,
                    multi: true,
                },
            ],
        });
    
        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
        router = TestBed.inject(Router);
        localStorage.clear();  // Clear localStorage before each test
        spyOn(router, 'navigate').and.stub();  // Spy on router navigation
    
        // Set the router's initial URL to a non-root path
        router.navigate(['/']);
    });

    afterEach(() => {
        httpMock.verify();  // Verify that no unmatched requests are outstanding.
    });

    it('should pass request if no token', () => {
        httpClient.get('/test').subscribe(response => {
            expect(response).toBeTruthy();
        });

        const httpRequest = httpMock.expectOne('/test');
        expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
        httpRequest.flush({ data: 'testData' });
    });

    it('should add token to header', () => {
        localStorage.setItem('token', 'test-token');
        httpClient.get('/test').subscribe(response => {
            expect(response).toBeTruthy();
        });

        const httpRequest = httpMock.expectOne('/test');
        expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
        expect(httpRequest.request.headers.get('Authorization')).toBe('Bearer test-token');
        httpRequest.flush({ data: 'testData' });
    });

    it('should handle HTTP errors and navigate to login', () => {
        localStorage.setItem('token', 'test-token');
        httpClient.get('/test').subscribe(
            response => fail('should have failed with the 401 error'),
            error => {
                expect(error).toBeTruthy();
                expect(router.navigate).toHaveBeenCalledWith(['/']);
            }
        );

        const httpRequest = httpMock.expectOne('/test');
        httpRequest.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should not add token to header if no token in storage', () => {
        httpClient.get('/test').subscribe(response => {
            expect(response).toBeTruthy();
        });

        const httpRequest = httpMock.expectOne('/test');
        expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
        httpRequest.flush({ data: 'testData' });
    });
});