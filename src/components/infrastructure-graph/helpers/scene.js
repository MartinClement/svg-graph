
const buildItemTargetedById = ({ itemsTargetedById = {}, item }) => {
  return item.to
    ? item.to.reduce((items, target ) => {
        return {...itemsTargetedById, [target]: items[target] ? [ ...items[target], item.id] : [item.id] };
      }, itemsTargetedById)
    : itemsTargetedById;
}

const buildHorizontalScene = (scene, config) => {
  const { width, height } = config;
  let targetedBy = {};
  const withItemXY = scene.reduce(( flatten, col, colIndex) => {
    const colRows = col.map((row, rowIndex) => {
      const x = (width/scene.length) * ( colIndex + 1) - (width/scene.length)/2;
      const y = (height/col.length) * (rowIndex + 1) - (height/col.length)/2;
      
      // UPDATE THE GLOBAL SCENE TARGETED_BY
      // IT STANDS THERE TO GAIN A FULL LOOP THROUGH THE SCENE
      targetedBy = buildItemTargetedById({ itemsTargetedById: targetedBy, item: row });
      
      return {...row, x, y};
    });
    return [...flatten, ...colRows];
  }, []);
  
  return  withItemXY.map(item => {
  	return { ...item, targetedBy: targetedBy[item.id] || [] };
  });
};


const buildVerticalScene = (scene, config) => {
  const { width, height } = config;
  let targetedBy = {};
  const withItemXY =  scene.reduce((flatten, row, rowIndex) => {
    const rowCols =  row.map((col, colIndex) => {
      const x = ((width/(row.length + 1)) * ( colIndex + 1));
      const y = (height/scene.length) * (rowIndex + 1) - (height/scene.length)/2;

      // UPDATE THE GLOBAL SCENE TARGETED_BY
      // IT STANDS THERE TO GAIN A FULL LOOP THROUGH THE SCENE
      targetedBy = buildItemTargetedById({ itemsTargetedById: targetedBy, item: row });

      return {...col, x, y};
    });

    return [...flatten, ...rowCols];
  }, []);

  return  withItemXY.map(item => {
  	return { ...item, targetedBy: targetedBy[item.id] || [] };
  });
}

const computePathStartY = ({ targetIndex, targetsLength, originsGap, y }) => {
  const length = (targetsLength-1) * originsGap;
  const halfLength = length / 2;
  return y + ((targetIndex) * originsGap - halfLength);
};

const genStraightPath = (item, target) => {
  return `M${item.x} ${item.y} L${target.x} ${target.y}`;
};

const genLTRZigZagPath = (item, target, config, context) => {
  const curveGutter = config.curveGutter;
  const middle = item.x + ((target.x - item.x) / 2);
  const turnStart = middle - curveGutter;

  if (target.x === item.x ) {
    return `M${item.x} ${item.y} V${target.y}`
  }

  const baseY = computePathStartY({
    targetIndex: context.targetIndex,
    targetsLength: context.targetsLength,
    originsGap: config.originsGap,
    y: item.y,
  });

  const endY = computedPathEndY({
    targetIndex: context.targetIndex,
    targetsLength: context.targetsLength,
    originsGap: config.originsGap,
  });

  if (baseY === target.y) {
    return `M${item.x} ${baseY} H${target.x}`
  }

  return `
     M${item.x} ${baseY}
     H${turnStart}
     C${middle} ${baseY}, ${middle} ${baseY}, ${middle} ${baseY > target.y ? baseY - curveGutter : baseY + curveGutter}
     V${baseY < target.y ? target.y - curveGutter : target.y + curveGutter }
     C${middle} ${target.y}, ${middle} ${target.y}, ${middle + curveGutter} ${ target.y}
     H${target.x}
   `;
}

const genPath = (item, target, config = {}, context) => {
  const pathKind = config.pathKind;

  switch(pathKind) {
    case 'straight':
      return genStraightPath(item, target);
    case 'zigzag':
      return genLTRZigZagPath(item, target, config, context);
  }
}

const buildLines = (scene, config) => {
  return scene.reduce((linesAcc, item) => {
    if (item.to) {
      const targetsLength = item.to.length;
      const res = item.to.reduce((acc, to, toIndex) => {
         const target = scene.find(itm => itm.id === to);
         if (target) {
          const path = genPath(item, target, config, { targetsLength, targetIndex: toIndex });
          return [
            ...acc,
            {
              status: target.status,
              'data-rely-to': item.id,
              path,
            },
          ]
         }
        return acc;
      }, []);
      return [...linesAcc, ...res];
    }
    return linesAcc;
  }, []);
}

export { buildHorizontalScene, buildVerticalScene, buildLines };