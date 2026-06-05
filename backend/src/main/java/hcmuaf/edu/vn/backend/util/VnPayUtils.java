package hcmuaf.edu.vn.backend.util;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

public class VnPayUtils {

    public static Map<String, String> getVnPayResponseParams(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();

        Map<String, String[]> parameterMap = request.getParameterMap();
        for (String key : parameterMap.keySet()) {
            String[] values = parameterMap.get(key);
            if (values != null && values.length > 0) {
                fields.put(key, values[0]);
            }
        }

        return fields;
    }
}
