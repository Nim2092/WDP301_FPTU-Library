import './AdvancedSearch.scss';

function AdvancedSearch() {
    return (
        <div className="advanced-search">
            <form>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" placeholder="Search by name" />
                    <select className="search-logic">
                        <option value="or">Or</option>
                        <option value="and">And</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <input type="text" placeholder="Search by category" />
                    <select className="search-logic">
                        <option value="or">Or</option>
                        <option value="and">And</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Date:</label>
                    <input type="text" placeholder="Search by date" />
                    <select className="search-logic">
                        <option value="or">Or</option>
                        <option value="and">And</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Location:</label>
                    <input type="text" placeholder="Search by location" />
                    <select className="search-logic">
                        <option value="or">Or</option>
                        <option value="and">And</option>
                    </select>
                </div>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}

export default AdvancedSearch;
