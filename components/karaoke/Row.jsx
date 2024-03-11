function Row(item) {
    return (
      <>
        <tr>
          <td scope="row">
            {item.selected ? (
              <input type="checkbox" name={item.index} checked />
            ) : (
              <input type="checkbox" name={item.index} />
            )}
          </td>
          <td>{item.artist}</td>
          <td>{item.song}</td>
          <td>{item.users}</td>
        </tr>
      </>
    );
  }

export default Row;