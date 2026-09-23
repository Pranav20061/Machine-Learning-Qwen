const Skeleton = ({ width = '100%', height = '20px', borderRadius = '4px' }) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="card p-3">
      <Skeleton width="100%" height="150px" borderRadius="8px" />
      <div className="mt-3">
        <Skeleton width="70%" height="20px" />
        <Skeleton width="90%" height="16px" className="mt-2" />
        <Skeleton width="50%" height="16px" className="mt-2" />
      </div>
      <div className="mt-3 d-flex gap-2">
        <Skeleton width="80px" height="36px" borderRadius="6px" />
        <Skeleton width="80px" height="36px" borderRadius="6px" />
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th><Skeleton width="100px" height="20px" /></th>
            <th><Skeleton width="150px" height="20px" /></th>
            <th><Skeleton width="120px" height="20px" /></th>
            <th><Skeleton width="100px" height="20px" /></th>
            <th><Skeleton width="80px" height="20px" /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <tr key={index}>
              <td><Skeleton width="200px" height="16px" /></td>
              <td><Skeleton width="150px" height="16px" /></td>
              <td><Skeleton width="100px" height="16px" /></td>
              <td><Skeleton width="80px" height="16px" /></td>
              <td><Skeleton width="60px" height="16px" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Skeleton;
