import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { fetchEntitiesFactory, fetchEntityFactory } from './fetchEntities';

chai.use(sinonChai);

global.API_URL = 'http://api';
global.fetch = sinon.stub();
global.fetch.returns(Promise.resolve());

describe('fetchEntitiesFactory', () => {
    it('should call fetch with correct parameters when called without jwt', () => {
        fetchEntitiesFactory('foo')();
        expect(fetch).to.have.been.calledWith('http://api/foo', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            },
            credentials: 'include',
        });
    });

    it('should call fetch with correct parameters when called with jwt', () => {
        fetchEntitiesFactory('foo')('token');
        expect(fetch).to.have.been.calledWith('http://api/foo', {
            headers: {
                Accept: 'application/json',
                Authorization: 'token',
                'Content-Type': 'application/json; charset=utf-8',
            },
            credentials: 'include',
        });
    });

    it('should handle failed response', done => {
        global.fetch.returns(Promise.resolve({
            ok: false,
            text: () => Promise.resolve('Run you fools !'),
        }));

        fetchEntitiesFactory('foo')().then(result => {
            expect(result).to.deep.equal({
                error: new Error('Run you fools !'),
            });

            done();
        }).catch(done);
    });

    it('should handle successfull response', done => {
        global.fetch.returns(Promise.resolve({
            ok: true,
            json: () => ['data'],
        }));

        fetchEntitiesFactory('foo')().then(result => {
            expect(result).to.deep.equal({
                list: ['data'],
            });
            done();
        }).catch(done);
    });
});

describe('fetchEntityFactory', () => {
    it('should call fetch with correct parameters when called without jwt', () => {
        fetchEntityFactory('foo')('entityId');
        expect(fetch).to.have.been.calledWith('http://api/foo/entityId', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            },
            credentials: 'include',
        });
    });

    it('should call fetch with correct parameters when called with jwt', () => {
        fetchEntityFactory('foo')('entityId', 'token');
        expect(fetch).to.have.been.calledWith('http://api/foo/entityId', {
            headers: {
                Accept: 'application/json',
                Authorization: 'token',
                'Content-Type': 'application/json; charset=utf-8',
            },
            credentials: 'include',
        });
    });

    it('should handle failed response', done => {
        global.fetch.returns(Promise.resolve({
            ok: false,
            text: () => Promise.resolve('Run you fools !'),
        }));

        fetchEntityFactory('foo')('entityId').then(result => {
            expect(result).to.deep.equal({
                error: new Error('Run you fools !'),
            });
            done();
        }).catch(done);
    });

    it('should handle successfull response', done => {
        global.fetch.returns(Promise.resolve({
            ok: true,
            json: () => 'data',
        }));

        fetchEntityFactory('foo')('entityId').then(result => {
            expect(result).to.deep.equal({
                item: 'data',
            });
            done();
        }).catch(done);
    });
});
