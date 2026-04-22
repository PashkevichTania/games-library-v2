'use client'

import { useCallback, useMemo, useState } from "react"

export default function useResizeObserver() {
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    })
    const resizeObserver = useMemo(
        () =>
            typeof window !== "undefined"
                ? new ResizeObserver(([container]) => {
                      setSize({
                          width: container.contentRect.width,
                          height: container.contentRect.height,
                      })
                  })
                : null,
        []
    )
    const measuredRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (node && resizeObserver) resizeObserver.observe(node)
            else if (resizeObserver) resizeObserver.disconnect()
        },
        [resizeObserver]
    )

    return { size, measuredRef }
}
