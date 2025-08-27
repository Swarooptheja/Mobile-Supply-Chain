

interface ResultSet {
    insertId: number;
    rowsAffected: number;
    rows: ResultSetRowList;
}

 interface ResultSetRowList {
    length: number;
    raw(): any[];
    item(index: number): any;
}

export function getDataFromResultSet(resultSet: ResultSet[]): any[] {
    // Add safety checks for undefined or null resultSet
    if (!resultSet || !resultSet[0].rows.length) {
        console.warn('getDataFromResultSet: resultSet or resultSet.rows is undefined/null');
        return [];
    }
    
    const data: any[] = [];
    for (let i = 0; i < resultSet[0].rows.length; i++) {
        data.push(resultSet[0].rows.item(i));
    }
    return data;
}